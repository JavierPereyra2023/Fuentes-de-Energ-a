const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // Hacer un HTML real y abrirlo via file://
  const fs = require('fs');
  const html = '<!DOCTYPE html><html><head>' +
    '<script src="../conceptos/modelo3D_rocket/assets/three.min.js"></' + 'script>' +
    '<script src="../conceptos/modelo3D_rocket/assets/OrbitControls.js"></' + 'script>' +
    '</head><body><script>window.result = { rev: THREE.REVISION, hasOC: typeof THREE.OrbitControls, hasSRGB: typeof THREE.SRGBColorSpace };</' + 'script></body></html>';
  fs.writeFileSync('D:/nucle-ar/output/test-umd.html', html);
  await page.goto('file:///D:/nucle-ar/output/test-umd.html');
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => window.result);
  console.log('Result:', JSON.stringify(r));
  console.log('Errors:', errors.length);
  errors.forEach(e => console.log('  ' + e));
  await browser.close();
})();
