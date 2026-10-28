export default async function run(page, ui) {
  const results = {};
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); });

  // Language switch
  await page.click('.lang-btn[data-lang="id"]');
  await page.waitForTimeout(200);
  results.heroID = await page.textContent('.hero-copy h1');
  results.navID = await page.textContent('.nav-cta');
  results.priceID = await page.textContent('.price-row h3');
  await page.click('.lang-btn[data-lang="en"]');
  await page.waitForTimeout(200);
  results.heroEN = await page.textContent('.hero-copy h1');

  // Nail conditional fields
  await page.selectOption('#service', { label: 'Nail Art' });
  results.nailFieldsVisible = await page.evaluate(() => !document.querySelector('#nailTypeRow').hidden && !document.querySelector('#nailStyleRow').hidden);
  await page.selectOption('#service', { label: 'Eyelash' });
  results.nailFieldsHidden = await page.evaluate(() => document.querySelector('#nailTypeRow').hidden && document.querySelector('#nailStyleRow').hidden);
  await page.selectOption('#service', { label: 'Nail Art' });

  // Validation: submit empty
  await page.evaluate(() => document.querySelector('#bookingForm').scrollIntoView());
  await page.click('.submit-button');
  await page.waitForTimeout(300);
  results.validationShown = await page.evaluate(() => document.querySelectorAll('.field-error.visible').length);

  // Fill valid
  await page.fill('#customerName', 'Rina Putri');
  await page.fill('#customerPhone', '081234567890');
  await page.fill('#nailStyle', 'soft french with chrome tips');
  await page.check('#confirm');
  await page.click('.submit-button');
  await page.waitForTimeout(300);
  results.dialogOpen = await page.evaluate(() => document.querySelector('#bookingDialog').open);
  results.summaryText = await page.textContent('#summaryContent');
  await page.screenshot({ path: 'qa-dialog.png' });
  await page.click('#editBooking');
  results.backToEdit = await page.evaluate(() => document.querySelector('#customerName').value === 'Rina Putri' && !document.querySelector('#bookingDialog').open);

  // Filters
  await page.click('.filter[data-filter="chrome"]');
  await page.waitForTimeout(300);
  results.chromeCount = await page.evaluate(() => document.querySelectorAll('.gallery-item:not(.is-hidden)').length);
  await page.click('.filter[data-filter="all"]');
  await page.waitForTimeout(300);
  results.allCount = await page.evaluate(() => document.querySelectorAll('.gallery-item:not(.is-hidden)').length);

  // Screenshots
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'qa-desktop-hero.png' });
  await page.evaluate(() => document.querySelector('#bookingForm').scrollIntoView());
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'qa-desktop-booking.png' });
  await page.evaluate(() => document.querySelector('.site-footer').scrollIntoView());
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'qa-desktop-footer.png' });

  // Mobile
  await page.setViewportSize({ width: 355, height: 800 });
  await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  results.overflowMobile = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: 'qa-mobile-hero.png' });
  // mobile menu
  await page.click('.menu-toggle');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'qa-mobile-menu.png' });
  await page.click('.menu-toggle');
  return results;
}
