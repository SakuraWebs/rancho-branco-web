const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Check bounding rect of body, root, header
    const bounds = await page.evaluate(() => {
      const root = document.getElementById('root').getBoundingClientRect();
      const body = document.body.getBoundingClientRect();
      const header = document.querySelector('header').getBoundingClientRect();
      const nav = document.querySelector('nav').getBoundingClientRect();
      return { root, body, header, nav };
    });
    
    console.log(JSON.stringify(bounds, null, 2));
    await browser.close();
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
