const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => {
    console.log('PE: msg=' + e.message);
    console.log('PE: stack=' + e.stack.split('\n').slice(0, 3).join(' | '));
  });
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/falcon-heavy-3d.html', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  // Check what scripts ran
  const ran = await page.evaluate(() => {
    return {
      dom: document.readyState,
      loading: document.getElementById('__bundler_loading')?.textContent,
      hasReact: typeof window.React !== 'undefined',
      hasDC: typeof window.DCLogic !== 'undefined',
      hasBabel: typeof window.Babel !== 'undefined',
    };
  });
  console.log('Page state:', JSON.stringify(ran));
  await browser.close();
})();
