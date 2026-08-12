const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  await page.goto('file:///D:/nucle-ar/conceptos/energia-espacial.html#sec04', { waitUntil: 'load' });
  // Esperar más para que los iframes carguen
  await page.waitForTimeout(8000);
  await page.evaluate(() => {
    const sec = document.getElementById('sec04');
    if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(5000);
  // Verificar via src del iframe
  const iframeSrcs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('iframe[data-rocket-iframe]')).map(f => ({
      src: f.src,
      dataSrc: f.getAttribute('data-src'),
      hasContent: !!f.contentDocument,
      readyState: f.contentDocument && f.contentDocument.readyState
    }));
  });
  console.log('Iframe status:', JSON.stringify(iframeSrcs, null, 2));
  // Screenshot del viewport (Starship card area)
  await page.screenshot({ path: 'D:/nucle-ar/output/energia-espacial-zoom.png', fullPage: false });
  await browser.close();
})();
