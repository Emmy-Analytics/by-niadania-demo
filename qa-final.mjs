import { chromium } from "playwright";
import { pathToFileURL } from "url";
import path from "path";

const dir = process.cwd();
const indexUrl = pathToFileURL(path.join(dir, "index.html")).href;
const serviceUrl = pathToFileURL(path.join(dir, "service.html")).href + "?cat=nail-art";

const results = {};
const browser = await chromium.launch();

// ---------- index.html ----------
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.goto(indexUrl, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  // Overflow at multiple widths
  results.overflow = {};
  for (const w of [375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width: w, height: 844 });
    await page.waitForTimeout(250);
    results.overflow[w] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);

  // Cart: add two items (one with variant)
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); });
  const addButtons = page.locator("[data-cart-add]");
  results.addButtons = await addButtons.count();
  // first row without variant
  await addButtons.first().click();
  // a variant row (French nail)
  const variantRow = page.locator(".cart-variant-row");
  if (await variantRow.count()) {
    await variantRow.first().locator("select").selectOption({ index: 1 });
    await variantRow.first().locator("[data-cart-add]").click();
  }
  await page.waitForTimeout(300);
  results.cartFloatVisible = await page.evaluate(() => !document.querySelector("#cartFloat").hidden);
  results.cartBadge = await page.evaluate(() => document.querySelector("#cartBadge").textContent);
  await page.click("#cartFloat");
  await page.waitForTimeout(400);
  results.drawerOpen = await page.evaluate(() => document.querySelector("#cartDrawer").open);
  results.cartItems = await page.locator("#cartItems .cart-item").count();
  results.cartText = await page.locator("#cartItems").textContent();
  await page.screenshot({ path: "qa-cart-drawer.png" });
  // checkout builds WhatsApp URL
  results.waUrl = await page.evaluate(() => {
    const state = window.__cartTestMessage;
    return null;
  });
  // capture the URL by intercepting window.open (fill the form first)
  await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
  await page.fill("#cartName", "Sarah");
  await page.fill("#cartDate", "2026-11-05");
  await page.fill("#cartTime", "14:30");
  await page.click("#cartCheckout");
  await page.waitForTimeout(300);
  results.waOpened = await page.evaluate(() => window.__opened.map(u => decodeURIComponent(u.split("text=")[1] || "")));
  results.cartStillFilled = await page.evaluate(() => JSON.parse(localStorage.getItem("byniadania-cart-v1") || "[]").length);
  // remove item (items list scrolls internally now)
  await page.evaluate(() => document.querySelector("[data-cart-remove]").click());
  await page.waitForTimeout(200);
  results.afterRemove = await page.locator("#cartItems .cart-item").count();
  // escape closes
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  results.drawerClosedByEsc = await page.evaluate(() => !document.querySelector("#cartDrawer").open);
  results.scrollUnlocked = await page.evaluate(() => !document.body.classList.contains("no-scroll"));

  // booking transition
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.click(".hero-actions a[href='#booking']");
  await page.waitForTimeout(1200);
  results.bookingInView = await page.evaluate(() => {
    const r = document.querySelector("#booking").getBoundingClientRect();
    return r.top >= -80 && r.top < 300;
  });
  results.headerCoversForm = await page.evaluate(() => {
    const r = document.querySelector("#booking").getBoundingClientRect();
    return r.top < 60; // header is sticky ~74px; if section top is above 60px it slides under
  });

  results.jsErrors = errors;
  await page.close();
}

// ---------- service.html ----------
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await page.goto(serviceUrl, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  // hero photo clickable -> lightbox
  const photo = page.locator("#servicePhoto");
  results.servicePhotoCursor = await photo.evaluate(el => getComputedStyle(el).cursor);
  await photo.click();
  await page.waitForTimeout(400);
  results.serviceLightboxOpen = await page.evaluate(() => !!document.querySelector("dialog.image-lightbox[open]"));
  await page.screenshot({ path: "qa-service-lightbox.png" });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  results.serviceLightboxClosed = await page.evaluate(() => !document.querySelector("dialog.image-lightbox"));
  results.serviceScrollUnlocked = await page.evaluate(() => !document.body.classList.contains("no-scroll"));
  results.serviceJsErrors = errors;
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
