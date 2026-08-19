// Compara la geometría real de <img> y <svg> entre celular y escritorio.
// Reporta lo que se ve en escritorio pero NO se ve en celular.
import { chromium } from 'file:///C:/Users/javie/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright/index.mjs';

const base = 'http://127.0.0.1:8765';
const paths = process.argv.slice(2);

const measure = async (context, path) => {
  const page = await context.newPage();
  const netErrors = [];
  page.on('requestfailed', r => { if (r.resourceType() === 'image') netErrors.push(r.url()); });
  page.on('response', r => { if (r.request().resourceType() === 'image' && r.status() >= 400) netErrors.push(r.status() + ' ' + r.url()); });
  await page.goto(base + path, { waitUntil: 'load', timeout: 30000 });
  await page.evaluate(async () => {
    for (const i of document.images) i.loading = 'eager';
    const step = Math.max(innerHeight * 0.7, 400);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 80));
    }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
  });
  await page.waitForTimeout(600);
  const data = await page.evaluate(() => {
    const key = el => {
      const p = [];
      for (let n = el; n && n.tagName; n = n.parentElement) {
        p.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + ':' + [...(n.parentElement?.children || [])].indexOf(n));
        if (n.id) break;
      }
      return p.join('>');
    };
    const items = [];
    document.querySelectorAll('img').forEach(el => {
      const r = el.getBoundingClientRect();
      items.push({ k: key(el), tag: 'img', src: (el.currentSrc || el.src).split('/').slice(-1)[0],
        w: Math.round(r.width), h: Math.round(r.height), nw: el.naturalWidth, nh: el.naturalHeight,
        broken: !el.complete || el.naturalWidth === 0 });
    });
    document.querySelectorAll('svg').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 && r.height < 2 && el.closest('.iconify')) return;
      const vb = el.getAttribute('viewBox');
      if (!vb) return; // ignorar iconos inline sin viewBox
      items.push({ k: key(el), tag: 'svg', src: 'viewBox=' + vb,
        w: Math.round(r.width), h: Math.round(r.height), nw: 0, nh: 0, broken: false });
    });
    return items;
  });
  await page.close();
  return { data, netErrors };
};

const browser = await chromium.launch({
  executablePath: 'C:/Users/javie/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const deskCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

let problems = 0;
for (const path of paths) {
  const m = await measure(mobCtx, path);
  const d = await measure(deskCtx, path);
  const dMap = new Map(d.data.map(x => [x.k, x]));
  const lines = [];

  for (const mi of m.data) {
    const di = dMap.get(mi.k);
    const mVisible = mi.w > 4 && mi.h > 4 && !mi.broken;
    const dVisible = di ? di.w > 4 && di.h > 4 && !di.broken : false;
    if (!mVisible && dVisible) {
      lines.push(`   OCULTO EN CELULAR  ${mi.tag}  ${mi.src}\n        cel ${mi.w}x${mi.h}${mi.broken ? ' (no cargó)' : ''}   |  esc ${di.w}x${di.h}\n        ${mi.k}`);
    } else if (mi.broken) {
      lines.push(`   ROTO EN AMBOS      ${mi.tag}  ${mi.src}`);
    }
  }
  for (const e of new Set([...m.netErrors])) lines.push(`   ERROR DE RED (cel)  ${e}`);

  if (lines.length) { problems++; console.log(`\n### ${path}`); lines.forEach(l => console.log(l)); }
  else console.log(`ok  ${path}`);
}
console.log(`\n=== ${problems} páginas con problemas de ${paths.length} ===`);
await browser.close();
