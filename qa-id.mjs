export default async function run(page) {
  await page.waitForFunction(() => window.__portfolioReady === true || document.querySelector('.gallery-notice'), null, { timeout: 25000 }).catch(() => { });
  await page.click('.lang-btn[data-lang="id"]');
  await page.waitForTimeout(800);
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
  await page.waitForTimeout(400);
  const out = await page.evaluate(() => ({
    navBook: document.querySelector('.nav-links .nav-cta')?.textContent,
    heroBook: document.querySelector('.hero-actions .button-dark')?.textContent,
    footerBook: document.querySelector('.footer-book')?.textContent,
    submit: document.querySelector('.submit-button')?.textContent,
    galleryCards: document.querySelectorAll('#galleryGrid .gallery-item').length,
    rulesTitle: document.querySelector('.booking-rules h2')?.textContent,
    rulesItems: [...document.querySelectorAll('.rules-item h3')].map(h => h.textContent.trim()),
    mixedEnTerms: (document.body.textContent.match(/appointment|janji temu/gi) || []).length,
    broken: [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).length,
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1
  }));
  await page.evaluate(() => document.querySelector('.gallery-actions')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'qa-id-gallery.png' });
  return out;
}
