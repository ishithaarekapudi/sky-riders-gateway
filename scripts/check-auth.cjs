const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function compile(path, mocks, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, require: name => { if (!(name in mocks)) throw Error(name); return mocks[name]; }, ...globals });
  return exports;
}
const navigation = compile('lib/auth-navigation.ts', {}, { URL, URLSearchParams });
const { friendlyAuthError } = compile('lib/auth-errors.ts', {});
function harness(signIn, token = 'first-challenge', options = {}) {
  const states = []; const effects = []; const recorded = []; const destinations = []; let cursor = 0; let calls = 0;
  const react = {
    useState(initial) { const i = cursor++; if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial; return [states[i], v => { states[i] = typeof v === 'function' ? v(states[i]) : v; }]; },
    useRef(initial) { const i = cursor++; if (!(i in states)) states[i] = { current: initial }; return states[i]; },
    useEffect(effect) { const i = cursor++; if (!(i in states)) { states[i] = true; effects.push(effect); } },
  };
  const jsx = (type, props, key) => ({ type, props, key });
  const Turnstile = () => null;
  const component = compile('app/account/AccountForm.tsx', {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx }, 'next/link': { default: 'a' },
    '../../lib/supabase/client': { createClient: () => ({ auth: {
      signInWithPassword: async args => { calls++; recorded.push(['login', args]); return signIn(args); },
      signUp: async args => { recorded.push(['signup', args]); return options.signupResult || {data:{user:{identities:[{}]},session:null},error:null}; },
      resetPasswordForEmail: async (...args) => { recorded.push(['reset',...args]); return {error:null}; },
      resend: async args => { recorded.push(['resend',args]); return {error:null}; },
      updateUser: async args => { recorded.push(['update',args]); return {error:null}; },
      getUser: async () => options.session === false ? {data:{user:null},error:null} : {data:{user:{id:'test-user'}},error:null},
      setSession: async args => { recorded.push(['session',args]);return {error:null}; },
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    } }) },
    '../../lib/auth-errors': { friendlyAuthError }, '../../lib/auth-navigation': navigation, '../ui': { BrandLogo: () => null }, '../components/Turnstile': { Turnstile },
  }, { process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://test.invalid', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test' } },
    URLSearchParams, window: { location: { search: '', hash: options.hash || '', pathname:'/account', origin: 'https://test.invalid', assign(path) {destinations.push(path);} }, history:{replaceState(){}}, setTimeout(fn){fn();} },
    document: { querySelector: () => ({value:token}) },
    FormData: class { get(key) { return { email: 'test@example.com', password: 'test-only-password', 'confirm-password': options.confirm ?? 'test-only-password', 'cf-turnstile-response': token, ...options.fields }[key]; } },
  }).AccountForm;
  function render() { cursor = 0; const tree = component({initialMode:options.mode||'login',nextPath:options.next||'/dashboard'}); effects.splice(0).forEach(fn=>fn()); return tree; }
  function find(node, pred) { if (!node || typeof node !== 'object') return; if (pred(node)) return node; for (const child of [node.props?.children].flat(Infinity)) { const result = find(child, pred); if (result) return result; } }
  return { render, find, Turnstile, recorded, destinations, calls: () => calls, submit: tree => find(tree, n => n.type === 'form').props.onSubmit({ preventDefault() {}, currentTarget: {} }) };
}
test('empty and non-text errors never leak raw JSON', () => {
  for (const value of [{}, {message:'{}'}, {message:'[object Object]'}, null, {message:'<html>error</html>'}]) assert.match(friendlyAuthError(value), /couldn’t complete/);
  assert.match(friendlyAuthError({ code:'captcha_failed', message:'{}' }), /security check/);
  assert.match(friendlyAuthError(new TypeError('Failed to fetch')), /can’t reach/);
  assert.match(friendlyAuthError({code:'invalid_credentials'}), /Forgot password/);
});
test('failed login refreshes the challenge and allows another attempt', async () => {
  const h = harness(async () => ({error:{message:'{}'}}));
  let tree=h.render(); const oldKey=h.find(tree,n=>n.type===h.Turnstile).key;
  await h.submit(tree); tree=h.render();
  assert.notEqual(h.find(tree,n=>n.type===h.Turnstile).key,oldKey);
  assert.match(h.find(tree,n=>n.props?.role==='status').props.children,/couldn’t complete/);
  assert.equal(h.find(tree,n=>n.props?.type==='submit').props.disabled,false);
  await h.submit(tree); assert.equal(h.calls(),2);
});
test('thrown network error releases the busy state and refreshes the token', async () => {
  const h=harness(async()=>{throw new TypeError('Failed to fetch')});
  const first=h.render(); await h.submit(first); const next=h.render();
  assert.match(h.find(next,n=>n.props?.role==='status').props.children,/can’t reach/);
  assert.equal(h.find(next,n=>n.props?.type==='submit').props.disabled,false);
  assert.notEqual(h.find(first,n=>n.type===h.Turnstile).key,h.find(next,n=>n.type===h.Turnstile).key);
});
test('rapid duplicate submits do not reuse a single-use challenge', async () => {
  let finish;const h=harness(()=>new Promise(resolve=>{finish=resolve}));
  const tree=h.render();const pending=h.submit(tree);await h.submit(tree);assert.equal(h.calls(),1);finish({error:{code:'invalid_credentials'}});await pending;
});
test('missing security token blocks the request without leaving the form busy', async () => {
  const h=harness(async()=>({error:null}), '');await h.submit(h.render());assert.equal(h.calls(),0);assert.equal(h.find(h.render(),n=>n.props?.type==='submit').props.disabled,false);
});
test('successful login follows the intended internal destination', async () => {
 const h=harness(async()=>({error:null}), 'token', {next:'/explore'});await h.submit(h.render());assert.deepEqual(h.destinations,['/explore']);
});
test('signup validates matching passwords and retains age restrictions', async () => {
 const h=harness(null,'token',{mode:'signup',confirm:'different'});await h.submit(h.render());assert.equal(h.recorded.length,0);assert.match(h.find(h.render(),n=>n.props?.role==='status').props.children,/do not match/);
 const under=harness(null,'token',{mode:'signup'});let tree=under.render();under.find(tree,n=>n.type==='select').props.onChange({target:{value:'under-13'}});await under.submit(under.render());assert.equal(under.recorded.length,0);assert.match(under.find(under.render(),n=>n.props?.role==='status').props.children,/parent or guardian/);
});
test('signup sends confirmation callback and handles an already-registered account', async () => {
 for(const duplicate of [false,true]) {
  const h=harness(null,'token',{mode:'signup',signupResult:{data:{user:{identities:duplicate?[]:[{}]},session:null},error:null}});let tree=h.render();h.find(tree,n=>n.type==='select').props.onChange({target:{value:'18-plus'}});await h.submit(h.render());
  assert.equal(h.recorded[0][0],'signup');assert.equal(new URL(h.recorded[0][1].options.emailRedirectTo).pathname,'/auth/callback');
  assert.match(h.find(h.render(),n=>n.props?.role==='status').props.children,duplicate?/already exists/:/confirmation link/);
 }
});
test('password reset requests use the password form as their destination', async () => {
 const h=harness(null,'token',{mode:'forgot'});await h.submit(h.render());const url=new URL(h.recorded[0][2].redirectTo);assert.equal(url.pathname,'/auth/callback');assert.equal(url.searchParams.get('next'),navigation.recoveryPath);
});
test('confirmation resend requires an email and then refreshes the check',async()=>{
 const h=harness(null);let tree=h.render();let button=h.find(tree,n=>n.props?.children==='Resend confirmation');await button.props.onClick();assert.equal(h.recorded.length,0);
 tree=h.render();h.find(tree,n=>n.props?.name==='email').props.onChange({target:{value:'test@example.com'}});tree=h.render();button=h.find(tree,n=>n.props?.children==='Resend confirmation');await button.props.onClick();assert.equal(h.recorded[0][0],'resend');
});
test('password update is unavailable without a valid recovery session',async()=>{
 const h=harness(null,'',{mode:'update-password',session:false});h.render();await new Promise(resolve=>setImmediate(resolve));const tree=h.render();assert.equal(h.find(tree,n=>n.type==='form'),undefined);assert(h.find(tree,n=>n.props?.children==='Request a new reset link'));
});
test('valid recovery session permits matching password update and dashboard redirect',async()=>{
 const h=harness(null,'',{mode:'update-password'});h.render();await new Promise(resolve=>setImmediate(resolve));await h.submit(h.render());assert.equal(h.recorded[0][0],'update');assert.deepEqual(h.destinations,['/dashboard']);
});
test('legacy recovery fragments establish a session before showing the password form',async()=>{
 const h=harness(null,'',{mode:'update-password',hash:'#access_token=test-access&refresh_token=test-refresh&type=recovery'});h.render();await new Promise(resolve=>setImmediate(resolve));assert.equal(h.recorded[0][0],'session');assert(h.find(h.render(),n=>n.type==='form'));
});
test('redirect sanitizer rejects external, encoded and malformed destinations',()=>{
 for(const value of ['https://evil.example','//evil.example','/\\evil.example','/%5cevil.example','/%252f%252fevil.example','/\nevil.example','/auth/callback','/%']) assert.equal(navigation.safeNext(value),'/dashboard');
 assert.equal(navigation.safeNext('/explore?interest=Gliding%20%26%20Soaring#near-you'),'/explore?interest=Gliding%20%26%20Soaring#near-you');
});
test('homepage fallback preserves recovery intent and handles expired links',()=>{
 assert.equal(navigation.authLinkDestination('', '#access_token=a&refresh_token=b&type=recovery'),'/account?mode=update-password#access_token=a&refresh_token=b&type=recovery');
 assert.match(navigation.authLinkDestination('?code=one-time',''),/^\/auth\/callback\?/);
 assert.equal(navigation.authLinkDestination('', '#error=access_denied'),'/account?mode=forgot&auth_error=invalid_link');
 assert.equal(navigation.authLinkDestination('?utm_source=email',''),null);
});
function callbackRoute(path, response, throwing=false) {
 return compile(path, {'next/server':{NextResponse:{redirect:(url,options)=>({url:String(url),options})}},'../../../lib/auth-navigation':navigation,'../../../lib/supabase/server':{createClient:async()=>({auth:{exchangeCodeForSession:async()=>{if(throwing)throw Error('offline');return response;},verifyOtp:async()=>response}})}},{URL,Set});
}
test('PKCE callbacks handle signup, recovery, failed exchange and missing codes',async()=>{
 for(const [recovery,next] of [[false,'/explore'],[true,navigation.recoveryPath]]) {
 const route=callbackRoute('app/auth/callback/route.ts',{data:{session:{},redirectType:recovery?'recovery':null},error:null});const result=await route.GET(new Request('https://www.ishitha.us/auth/callback?code=abc&next=/explore'));assert.equal(new URL(result.url).pathname+new URL(result.url).search,next);assert.equal(result.options.headers['Cache-Control'],'no-store');
 }
 for(const url of ['https://www.ishitha.us/auth/callback','https://www.ishitha.us/auth/callback?code=expired']) {const result=await callbackRoute('app/auth/callback/route.ts',{data:{session:null},error:{}}).GET(new Request(url));assert.equal(new URL(result.url).searchParams.get('auth_error'),'invalid_link');}
 const result=await callbackRoute('app/auth/callback/route.ts',null,true).GET(new Request('https://www.ishitha.us/auth/callback?code=abc'));assert.equal(new URL(result.url).pathname,'/account');
});
test('token-hash recovery always goes to password update; invalid types get a fresh-link path',async()=>{
 const route=callbackRoute('app/auth/confirm/route.ts',{data:{session:{}},error:null});const result=await route.GET(new Request('https://www.ishitha.us/auth/confirm?token_hash=test&type=recovery&next=/'));assert.equal(new URL(result.url).pathname+new URL(result.url).search,navigation.recoveryPath);
 const invalid=await route.GET(new Request('https://www.ishitha.us/auth/confirm?token_hash=test&type=anything'));assert.equal(new URL(invalid.url).searchParams.get('auth_error'),'invalid_link');
});
