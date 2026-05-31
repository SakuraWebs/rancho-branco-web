const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));
    const rootHTML = await page.$eval('#root', el => el.innerHTML).catch(() => 'No root');
    console.log('ROOT LENGTH:', rootHTML.length);
    console.log('ROOT START:', rootHTML.substring(0, 100));
    await browser.close();
  } catch (err) {
    console.log('SCRIPT ERROR:', err.message);
  }
})();
