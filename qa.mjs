export default async function run(page, ui) {
  const widths = [355, 360, 375, 390, 430, 768, 1024, 1280, 1440];
  const results = [];
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    // force all reveals visible for measurement
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    results.push({ width: w, overflow });
  }
  // screenshots at 355 and 1280, scrolled through
  for (const [w, name] of [[355, 'm355'], [1280, 'd1280']]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const h = await page.evaluate(() => document.body.scrollHeight);
    const steps = 8;
    for (let i = 0; i < steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.floor(h / steps * i));
      await page.waitForTimeout(350);
    }
    await page.screenshot({ path: `qa-scroll-${name}.png` });
  }
  return results;
}
