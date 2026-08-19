// Detecta desborde horizontal en celular y culpa al elemento concreto.
import { chromium } from 'file:///C:/Users/javie/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright/index.mjs';

const base = 'http://127.0.0.1:8765';
const browser = await chromium.launch({
  executablePath: 'C:/Users/javie/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

let malas = 0;
for (const path of process.argv.slice(2)) {
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'load', timeout: 40000 }).catch(() => {});
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const doc = document.documentElement.scrollWidth;
    if (doc <= vw + 1) return { ok: true, vw, doc };
    const culpables = [];
    for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect();
      const right = b.right + scrollX;
      if (right > vw + 1 && b.width > 0) {
        // solo el elemento mas externo que desborda
        if (culpables.some(c => c.el.contains(el))) continue;
        culpables.push({ el, desc: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
          (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''),
          right: Math.round(right), w: Math.round(b.width) });
      }
    }
    return { ok: false, vw, doc, culpables: culpables.slice(0, 6).map(c => ({ desc: c.desc, right: c.right, w: c.w })) };
  });
  if (!r.ok) {
    malas++;
    console.log(`\n### ${path}   ancho documento ${r.doc}px vs viewport ${r.vw}px  (+${r.doc - r.vw})`);
    r.culpables.forEach(c => console.log(`     ${c.desc}  ancho=${c.w} borde derecho=${c.right}`));
  }
  await page.close();
}
console.log(`\n=== ${malas} páginas con desborde horizontal ===`);
await browser.close();
