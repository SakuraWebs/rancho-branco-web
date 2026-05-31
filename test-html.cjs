const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Evaluate the html
    const html = await page.content();
    console.log('HTML CONTENT:', html.substring(0, 1500));
    
    await browser.close();
  } catch (err) {
    console.log('SCRIPT ERROR:', err.message);
  }
})();
