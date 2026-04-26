import { chromium } from "playwright";

const APP_URL = process.env.APP_URL || "http://localhost:5173";

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ 
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2 
  });
  const page = await ctx.newPage();

  // 1. Go to app - should show splash first
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "tmp/01_splash.png" });

  // 2. Wait for form to appear
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "tmp/02_form.png" });

  // 3. Fill form
  await page.locator('input[type="text"]').first().fill("Luther Anderson");
  await page.locator('select').first().selectOption("7");
  await page.locator('input[placeholder="Day"]').fill("15");
  await page.locator('input[placeholder="Year"]').fill("1990");
  await page.screenshot({ path: "tmp/03_form_filled.png" });

  // 4. Submit
  await page.locator('button:has-text("Reveal")').click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "tmp/04_home.png" });

  // 5. Scroll home
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: "tmp/05_home_scroll.png" });

  // 6. Calendar
  await page.locator('text=Calendar').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "tmp/06_calendar.png" });

  // 7. You
  await page.locator('text=You').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "tmp/07_you.png" });

  // 8. Chart
  await page.locator('text=Chart').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "tmp/08_chart.png" });

  await browser.close();
  console.log("All screenshots saved to tmp/");
}

main().catch(e => { console.error(e); process.exit(1); });
