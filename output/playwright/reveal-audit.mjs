// Audita si algún bloque .reveal queda invisible (opacity 0) tras recorrer la página.
// Compara viewport de celular vs escritorio.
import { chromium } from 'file:///C:/Users/javie/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright/index.mjs';

const base = 'http://127.0.0.1:8765';
const paths = process.argv.slice(2);

const audit = async (page, path) => {
  await page.goto(base + path, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(300);
  // recorrer toda la página como haría un lector
  await page.evaluate(async () => {
    const step = Math.max(innerHeight * 0.7, 400);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise(r => setTimeout(r, 90));
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(r => setTimeout(r, 400));
  });
  await page.waitForTimeout(500);
  return page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.reveal').forEach(el => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.9) {
        out.push({
          id: el.id || el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.'),
          h: Math.round(el.getBoundingClientRect().height),
          vh: innerHeight,
          ratioMax: +(innerHeight / el.getBoundingClientRect().height).toFixed(3),
          imgs: el.querySelectorAll('img').length,
        });
      }
    });
    return out;
  });
};

const browser = await chromium.launch({
  executablePath: 'C:/Users/javie/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
for (const path of paths) {
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const [m, d] = [await audit(await mob.newPage(), path), await audit(await desk.newPage(), path)];
  if (m.length || d.length) {
    console.log(`\n### ${path}`);
    console.log(`  CELULAR  (390x844): ${m.length} bloques ocultos`);
    m.forEach(x => console.log(`     - ${x.id} alto=${x.h}px ratioMax=${x.ratioMax} imgs=${x.imgs}`));
    console.log(`  ESCRITORIO(1440x900): ${d.length} bloques ocultos`);
    d.forEach(x => console.log(`     - ${x.id} alto=${x.h}px ratioMax=${x.ratioMax} imgs=${x.imgs}`));
  } else {
    console.log(`ok  ${path}`);
  }
  await mob.close(); await desk.close();
}
await browser.close();
