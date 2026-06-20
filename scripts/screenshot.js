const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'https://cryptonite-seven-phi.vercel.app';
const OUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');

const pages = [
  { name: 'home',      path: '/',             wait: 3000 },
  { name: 'market',    path: '/ProductsPage', wait: 4000 },
  { name: 'coin',      path: '/coins/bitcoin',wait: 5000 },
  { name: 'buy',       path: '/buy',          wait: 3000 },
  { name: 'portfolio', path: '/portfolio',    wait: 3000 },
];

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const page of pages) {
    console.log(`Screenshotting ${page.name}...`);
    const tab = await browser.newPage();
    await tab.setViewport({ width: 1440, height: 900 });
    await tab.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, page.wait));
    await tab.screenshot({ path: path.join(OUT_DIR, `${page.name}.png`), fullPage: false });
    await tab.close();
    console.log(`  ✓ saved ${page.name}.png`);
  }

  await browser.close();
  console.log('Done! Screenshots saved to public/screenshots/');
})();
