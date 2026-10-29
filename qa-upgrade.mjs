// Targeted QA for the 2026-10-29 upgrade: prices, cart form, WhatsApp message,
// drag floating cart, nail CTA, brand navigation, console errors.
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const root = path.dirname(fileURLToPath(import.meta.url));
const indexUrl = pathToFileURL(path.join(root, "index.html")).href;
const serviceUrl = pathToFileURL(path.join(root, "service.html")).href + "?cat=nail-art";
const out = {};
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("pageerror", e => errors.push("pageerror: " + e.message));
page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });

await page.goto(indexUrl);
await page.evaluate(() => localStorage.clear());
await page.reload();

// --- price format in cart
await page.locator("[data-cart-add]").first().click();
const rangeRow = page.locator(".cart-variant-row").first();
if (await rangeRow.count()) {
  await rangeRow.locator("select").selectOption({ index: 1 });
  await rangeRow.locator("[data-cart-add]").click();
}
out.cartPrices = await page.evaluate(() =>
  [...document.querySelectorAll(".cart-item-price")].map(e => e.textContent.trim()));

// --- drag the floating cart to top-left
const before = await page.evaluate(() => { const r = document.querySelector("#cartFloat").getBoundingClientRect(); return { x: r.left, y: r.top }; });
const fb = page.locator("#cartFloat");
const bb = await fb.boundingBox();
await page.mouse.move(bb.x + 20, bb.y + 20);
await page.mouse.down();
await page.mouse.move(bb.x + 20 - (bb.x - 20), bb.y + 20 - (bb.y - 30), { steps: 8 });
await page.mouse.up();
const after = await page.evaluate(() => { const r = document.querySelector("#cartFloat").getBoundingClientRect(); return { x: r.left, y: r.top }; });
out.dragMoved = Math.abs(after.x - before.x) > 20 || Math.abs(after.y - before.y) > 20;
out.dragPos = after;

// --- tap (not drag) still opens the drawer
await fb.click();
out.drawerOpenByTap = await page.evaluate(() => document.querySelector("#cartDrawer").open);

// --- validation: empty fields must block WhatsApp
await page.evaluate(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return null; }; });
await page.click("#cartCheckout");
out.validationShown = await page.evaluate(() =>
  [...document.querySelectorAll(".cart-field-error")].filter(e => !e.hidden).map(e => e.textContent));
out.waBlockedWhenEmpty = (await page.evaluate(() => window.__opened.length)) === 0;

// --- fill form, checkout -> WhatsApp message
await page.fill("#cartName", "Sarah");
await page.fill("#cartDate", "2026-11-05");
await page.fill("#cartTime", "14:30");
await page.fill("#cartNotes", "Soft pink please");
await page.click("#cartCheckout");
out.waMessage = await page.evaluate(() => decodeURIComponent((window.__opened[0] || "").split("text=")[1] || ""));
out.cartStillFilled = await page.evaluate(() => JSON.parse(localStorage.getItem("byniadania-cart-v1") || "[]").length);

// remove item updates subtotal
await page.locator("[data-cart-remove]").first().click();
out.itemsAfterRemove = await page.locator("#cartItems .cart-item").count();
out.subtotalAfterRemove = await page.evaluate(() => document.querySelector(".cart-subtotal strong")?.textContent || "");
await page.keyboard.press("Escape");

// --- choose-nail CTA opens WhatsApp with nail message
await page.evaluate(() => { window.__opened = []; });
await page.locator(".choose-nail").click();
out.nailCtaMessage = await page.evaluate(() => decodeURIComponent((window.__opened[0] || "").split("text=")[1] || ""));

// --- brand navigation from service page
await page.goto(serviceUrl);
out.serviceBrandHref = await page.evaluate(() => document.querySelector("a.brand").getAttribute("href"));
await page.locator("a.brand").click();
await page.waitForTimeout(400);
out.brandNavUrl = page.url();

// --- overflow at key viewports (index)
const widths = [320, 360, 390, 430, 768, 1024, 1440];
out.overflow = {};
for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(indexUrl);
  out.overflow[w] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}
out.jsErrors = errors;
await browser.close();
console.log(JSON.stringify(out, null, 2));
