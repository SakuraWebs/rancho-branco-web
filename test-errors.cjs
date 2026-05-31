const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Evaluate the error log
    const errorText = await page.$eval('#error-log', el => el.textContent);
    console.log('DOM Error Log:', errorText);
    
    await browser.close();
  } catch (err) {
    console.log('SCRIPT ERROR:', err.message);
  }
})();
