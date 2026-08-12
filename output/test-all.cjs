const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  const consoleMsgs = [];
  page.on('pageerror', e => errors.push('PAGE_ERROR: ' + e.message));
  page.on('console', msg => consoleMsgs.push(msg.type() + ': ' + msg.text()));
  // Test falcon 9
  console.log('--- Falcon 9 ---');
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/falcon-9/falcon9-3d.html', { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  const info9 = await page.evaluate(() => {
    const stage = document.querySelector('three-d-stage');
    return { hasStage: !!stage, hasObj: !!(stage && stage._object), name: stage && stage._object && stage._object.name };
  });
  console.log('F9:', JSON.stringify(info9));
  errors.length = 0;
  // Test starship
  console.log('--- Starship ---');
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/starship/starship.html', { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  const infoS = await page.evaluate(() => {
    const stage = document.querySelector('three-d-stage');
    const obj = stage && stage._object;
    return { hasStage: !!stage, hasObj: !!obj, name: obj && obj.name, children: obj && obj.children.length };
  });
  console.log('SH:', JSON.stringify(infoS));
  errors.length = 0;
  // Test falcon heavy
  console.log('--- Falcon Heavy ---');
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/falcon-heavy-3d.html', { waitUntil: 'load' });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'D:/nucle-ar/output/falcon-heavy-fixed.png' });
  const infoH = await page.evaluate(() => {
    return { hasCanvas: !!document.querySelector('canvas'), bodyText: document.body.textContent.substring(0, 200) };
  });
  console.log('FH:', JSON.stringify(infoH));
  console.log('FH errors:', errors.length);
  errors.forEach(e => console.log('  ' + e));
  await browser.close();
})();
