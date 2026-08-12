const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  await page.goto('file:///D:/nucle-ar/conceptos/energia-espacial.html#sec04', { waitUntil: 'load' });
  await page.waitForTimeout(5000);
  // Scrollear a sec04
  await page.evaluate(() => {
    const sec = document.getElementById('sec04');
    if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(3000);
  // Verificar que el iframe de Starship cargó el modelo
  const iframeInfo = await page.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe[data-rocket-iframe]'));
    return iframes.map(f => {
      try {
        const stage = f.contentDocument.querySelector('three-d-stage');
        const obj = stage && stage._object;
        return {
          src: f.getAttribute('data-src'),
          hasStage: !!stage,
          hasObj: !!obj,
          name: obj && obj.name,
          children: obj ? obj.children.map(c => c.name) : null
        };
      } catch (e) {
        return { src: f.getAttribute('data-src'), error: e.message };
      }
    });
  });
  console.log('Iframes:', JSON.stringify(iframeInfo, null, 2));
  // Screenshot
  await page.screenshot({ path: 'D:/nucle-ar/output/energia-espacial-sec04.png' });
  await browser.close();
})();
