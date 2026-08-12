const { chromium } = require('C:/Users/javie/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => {
    console.log('PE: ' + e.message);
    if (e.stack) console.log('  stack: ' + e.stack.split('\n').slice(0, 5).join('\n  '));
  });
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warn' || msg.type() === 'log') {
      console.log('[' + msg.type() + '] ' + msg.text());
    }
  });
  await page.goto('file:///D:/nucle-ar/conceptos/modelo3D_rocket/falcon-heavy-3d.html');
  await page.waitForTimeout(3000);
  // Inject a test
  const result = await page.evaluate(() => {
    return {
      hasDC: typeof window.DCLogic,
      hasReact: typeof window.React,
      hasBabel: typeof window.Babel,
      dom: document.readyState,
      loading: document.getElementById('__bundler_loading')?.textContent
    };
  });
  console.log('State:', JSON.stringify(result));
  await browser.close();
})();
