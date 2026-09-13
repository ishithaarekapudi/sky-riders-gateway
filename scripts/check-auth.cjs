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
const { friendlyAuthError } = compile('lib/auth-errors.ts', {});
function harness(signIn, token = 'first-challenge') {
  const states = []; let cursor = 0; let calls = 0;
  const react = {
    useState(initial) { const i = cursor++; if (!(i in states)) states[i] = typeof initial === 'function' ? initial() : initial; return [states[i], v => { states[i] = typeof v === 'function' ? v(states[i]) : v; }]; },
    useRef(initial) { const i = cursor++; if (!(i in states)) states[i] = { current: initial }; return states[i]; },
    useEffect() {},
  };
  const jsx = (type, props, key) => ({ type, props, key });
  const Turnstile = () => null;
  const component = compile('app/account/page.tsx', {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx }, 'next/link': { default: 'a' },
    '../../lib/supabase/client': { createClient: () => ({ auth: { signInWithPassword: async args => { calls++; return signIn(args); } } }) },
    '../../lib/auth-errors': { friendlyAuthError }, '../ui': { BrandLogo: () => null }, '../components/Turnstile': { Turnstile },
  }, { process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://test.invalid', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test' } },
    URLSearchParams, window: { location: { search: '', origin: 'https://test.invalid', assign() {} } },
    FormData: class { get(key) { return { email: 'test@example.com', password: 'test-only-password', 'cf-turnstile-response': token }[key]; } },
  }).default;
  function render() { cursor = 0; return component(); }
  function find(node, pred) { if (!node || typeof node !== 'object') return; if (pred(node)) return node; for (const child of [node.props?.children].flat(Infinity)) { const result = find(child, pred); if (result) return result; } }
  return { render, find, Turnstile, calls: () => calls, submit: tree => find(tree, n => n.type === 'form').props.onSubmit({ preventDefault() {}, currentTarget: {} }) };
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
