import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Run after next build; inspect actual rendered HTML, not metadata source objects.
const root = resolve('.next/server/app');
const sitemap = readFileSync(`${root}/sitemap.xml.body`, 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const origin = 'https://www.ishitha.us';
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'))].map(([text]) => Object.fromEntries([...text.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)])));
const titles = new Set();
assert(urls.length > 0);
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
assert(!sitemap.includes('<lastmod>'), 'Do not invent content update dates');
for (const url of urls) {
  assert.equal(new URL(url).origin, origin);
  const path = new URL(url).pathname;
  const file = `${root}/${path === '/' ? 'index' : path.slice(1)}.html`;
  assert(existsSync(file), `Sitemap page missing: ${path}`);
  const html = readFileSync(file, 'utf8');
  const meta = tags(html, 'meta');
  const value = name => meta.find(tag => tag.name === name || tag.property === name)?.content;
  const canonical = tags(html, 'link').filter(tag => tag.rel === 'canonical');
  assert.equal(canonical.length, 1, `Canonical count: ${path}`);
  assert.equal(new URL(canonical[0].href).href, new URL(url).href, `Canonical mismatch: ${path}`);
  assert(value('description'), `Missing description: ${path}`);
  assert(!value('robots')?.includes('noindex'), `Sitemap page is noindex: ${path}`);
  assert.equal(new URL(value('og:url')).href, new URL(url).href, `Sharing URL mismatch: ${path}`);
  assert.equal(value('og:description'), value('description'));
  assert.equal(value('twitter:card'), 'summary_large_image');
  for (const name of ['og:image', 'twitter:image']) {
    const image = new URL(value(name), origin);
    assert.equal(image.origin, origin);
    assert(existsSync(resolve('public', image.pathname.slice(1))), `Missing image: ${image}`);
  }
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Missing/duplicate title: ${path}`);
  titles.add(title);
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) JSON.parse(json);
}
const robots = readFileSync(`${root}/robots.txt.body`, 'utf8');
for (const path of ['account', 'dashboard', 'parent-consent', 'privacy/delete', 'about/contact']) {
  const html = readFileSync(`${root}/${path}.html`, 'utf8');
  const meta = tags(html, 'meta');
  assert(meta.some(tag => tag.name === 'robots' && tag.content.includes('noindex')), `Missing noindex: ${path}`);
  assert(!meta.some(tag => tag.name === 'googlebot' && /(^|,\s*)index(,|$)/.test(tag.content)), `Conflicting Googlebot directive: ${path}`);
  assert(!robots.includes(`Disallow: /${path}`), `noindex page blocked from crawling: ${path}`);
  assert(!urls.includes(`${origin}/${path}`));
}
const home = readFileSync(`${root}/index.html`, 'utf8');
const cards = tags(home, 'a').filter(tag => tag.class?.includes('aviation-path-card'));
assert.equal(cards.length, 6);
for (const card of cards) assert(urls.includes(`${origin}${card.href}`), `Broken career link: ${card.href}`);
console.log(`SEO checks passed: ${urls.length} sitemap pages, 5 noindex pages, 6 career links, social images, unique titles, canonicals and valid JSON-LD.`);
