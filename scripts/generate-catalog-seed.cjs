// Preserve the complete existing editorial content when enabling database editing.
const fs = require('node:fs'); const path = require('node:path'); const ts = require('typescript'); const vm = require('node:vm');
function load(file) { const filename = path.resolve(file); const module = { exports: {} }; vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText, { module, exports:module.exports, require: id => id === 'next/cache' ? {unstable_cache: x => x} : id.startsWith('.') ? load(path.resolve(path.dirname(filename),id+'.ts')) : require(id) }); return module.exports; }
const { seededCatalog } = load('lib/catalog.ts');
const q = value => "'" + String(value).replaceAll("'", "''") + "'";
let sql = '-- Preserve current site content; do not overwrite listings already edited in the CMS.\nbegin;\n';
for (const kind of ['organizations','careers','scholarships']) for (const item of seededCatalog(kind)) {
  const table = {organizations:'organizations',careers:'career_paths',scholarships:'opportunities'}[kind], title = kind === 'organizations' ? 'name' : 'title', summary = kind === 'organizations' ? 'description' : 'summary';
  const data = q(JSON.stringify(item)) + '::jsonb';
  const typeWhere = kind === 'scholarships' ? " and type = 'scholarship'" : '';
  sql += `insert into public.${table} (slug, ${title}, ${summary}, published, directory_content${kind==='scholarships'?', type':''}) select ${q(item.slug)}, ${q(item.title)}, ${q(item.summary)}, true, ${data}${kind==='scholarships'?", 'scholarship'":''} where not exists (select 1 from public.${table} where (slug = ${q(item.slug)} or ${title} = ${q(item.title)})${typeWhere});\n`;
  sql += `update public.${table} set directory_content = ${data} where directory_content is null and (slug = ${q(item.slug)} or ${title} = ${q(item.title)})${typeWhere};\n`;
}
sql += 'commit;\n';
fs.writeFileSync('supabase/migrations/202609130012_directory_content_seed.sql',sql);
