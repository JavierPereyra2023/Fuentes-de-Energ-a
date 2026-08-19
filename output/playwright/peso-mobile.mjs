// Mide el peso de imágenes por página y simula una conexión móvil real (4G lento).
import { chromium } from 'file:///C:/Users/javie/AppData/Local/npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright/index.mjs';

const base = 'http://127.0.0.1:8765';
const paths = process.argv.slice(2);

const browser = await chromium.launch({
  executablePath: 'C:/Users/javie/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

const rows = [];
for (const path of paths) {
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  // 4G lento típico de celular en Argentina: ~1.6 Mbps bajada, 150 ms RTT
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150,
  });

  let bytes = 0, count = 0;
  page.on('response', async r => {
    if (r.request().resourceType() === 'image') {
      count++;
      const len = Number(r.headers()['content-length'] || 0);
      bytes += len;
    }
  });

  const t0 = Date.now();
  let timedOut = false;
  try {
    await page.goto(base + path, { waitUntil: 'load', timeout: 45000 });
  } catch { timedOut = true; }
  await page.evaluate(async () => {
    for (const i of document.images) i.loading = 'eager';
    const step = Math.max(innerHeight * 0.7, 400);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 60));
    }
  }).catch(() => {});
  // esperar hasta 20 s a que terminen de cargar las imágenes
  const settled = await page.evaluate(() => new Promise(res => {
    const deadline = Date.now() + 20000;
    const tick = () => {
      const imgs = [...document.images];
      const pend = imgs.filter(i => !i.complete || i.naturalWidth === 0);
      if (!pend.length || Date.now() > deadline) res({ total: imgs.length, pendientes: pend.map(i => i.src.split('/').pop()) });
      else setTimeout(tick, 250);
    };
    tick();
  })).catch(() => ({ total: 0, pendientes: [] }));

  rows.push({ path, MB: +(bytes / 1048576).toFixed(1), imgs: count, seg: +((Date.now() - t0) / 1000).toFixed(1), timedOut, pend: settled.pendientes });
  await page.close();
}

rows.sort((a, b) => b.MB - a.MB);
console.log('  MB  imgs   seg   página');
for (const r of rows) {
  const flag = r.timedOut ? ' ⛔load>45s' : '';
  console.log(`${String(r.MB).padStart(5)} ${String(r.imgs).padStart(4)} ${String(r.seg).padStart(6)}   ${r.path}${flag}`);
  if (r.pend.length) console.log(`        ⚠ sin cargar tras 20s: ${r.pend.join(', ')}`);
}
await browser.close();
