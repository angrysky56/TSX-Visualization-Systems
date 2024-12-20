import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Example: Update chart data
  await page.evaluate(() => {
    window.updateChartData([
      { name: 'A', value: Math.random() * 100 },
      { name: 'B', value: Math.random() * 100 },
      { name: 'C', value: Math.random() * 100 }
    ]);
  });

  // Take screenshot
  await page.screenshot({ path: 'visualization.png' });
  await browser.close();
})();