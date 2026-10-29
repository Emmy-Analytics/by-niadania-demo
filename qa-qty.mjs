// QA: quantity controls, merging, price format k, studio video fallback
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
const root = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(root, "index.html")).href;
const out = {}; const errs = [];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on("pageerror", e => errs.push(e.message));

await p.goto(url);
await p.evaluate(() => localStorage.clear());
await p.reload();
await p.waitForTimeout(600);

// add overlay (Rp10k) twice via pricelist button -> qty merge
await p.locator("[data-cart-add]").first().click();
await p.locator("[data-cart-add]").first().click();
out.afterTwoAdds = await p.evaluate(() => {
  const c = JSON.parse(localStorage.getItem("byniadania-cart-v1") || "[]");
  return { items: c.length, qty: c[0]?.qty, badge: document.querySelector("#cartBadge").textContent };
});

// open drawer, press + and −
await p.locator("#cartFloat").click();
await p.waitForTimeout(300);
out.qtyShown = await p.locator(".cart-qty-num").first().textContent();
await p.locator('[data-qty-inc]').first().click();
out.afterInc = await p.locator(".cart-qty-num").first().textContent();
out.subtotalAfterInc = await p.evaluate(() => document.querySelector(".cart-subtotal strong")?.textContent);
await p.locator('[data-qty-dec]').first().click();
await p.locator('[data-qty-dec]').first().click();
out.afterTwoDec = await p.locator(".cart-qty-num").first().textContent(); // min 1
out.badgeAfterDec = await p.evaluate(() => document.querySelector("#cartBadge").textContent);
await p.keyboard.press("Escape");
await p.waitForTimeout(300);

// price formats in pricelist
out.priceSamples = await p.evaluate(() =>
  [...document.querySelectorAll("#prices .price-row strong")].slice(0, 6).map(e => e.textContent.trim()));

// studio video placeholder visible, no empty player
out.studioFallbackVisible = await p.evaluate(() => {
  const w = document.querySelector("[data-studio-video]");
  return { fallback: getComputedStyle(w.querySelector(".studio-video-fallback")).display !== "none", videoHidden: w.querySelector("video").hidden };
});

// different variants stay separate items
const vr = p.locator(".cart-variant-row").first();
if (await vr.count()) {
  await vr.locator("select").selectOption({ index: 1 });
  await vr.locator("[data-cart-add]").click();
  await vr.locator("select").selectOption({ index: 2 });
  await vr.locator("[data-cart-add]").click();
  out.variantItems = await p.evaluate(() => JSON.parse(localStorage.getItem("byniadania-cart-v1") || "[]").map(i => ({ n: i.name, v: i.variant, q: i.qty })));
}

// WA message includes qty/subtotal
await p.evaluate(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return null; }; });
await p.fill("#cartName", "Sarah");
await p.fill("#cartDate", "2026-11-05");
await p.fill("#cartTime", "14:30");
await p.click("#cartCheckout");
out.waHasQty = await p.evaluate(() => {
  const msg = decodeURIComponent((window.__opened[0] || "").split("text=")[1] || "");
  return { hasQty: msg.includes("Quantity: 2"), hasSubtotal: msg.includes("Item subtotal: Rp20k"), msg };
});

// drawer fully gone after close
await p.keyboard.press("Escape");
out.drawerClosed = await p.evaluate(() => !document.querySelector("#cartDrawer").open);
out.overflow320 = await p.evaluate(() => 0);
await p.setViewportSize({ width: 320, height: 800 });
await p.waitForTimeout(300);
out.overflow320 = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
out.errors = errs;
console.log(JSON.stringify(out, null, 1));
await b.close();
