// Full QA for the reviews feature + P0 hotfix verification
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
const root = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(root, "index.html")).href;
const out = {}; const errs = [];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on("pageerror", e => errs.push(e.message));
p.on("requestfailed", r => errs.push("reqfail: " + r.url().slice(0, 80)));

await p.goto(url);
await p.waitForTimeout(1800);
out.emptyShown = await p.evaluate(() => !document.querySelector("#reviewsEmpty").hidden);

// form flow
await p.locator("#writeReviewBtn").click();
await p.waitForTimeout(300);
out.modalOpen = await p.evaluate(() => document.querySelector("#reviewFormModal").open);
await p.fill("#rvName", "QA Tester");
await p.selectOption("#rvService", "Nail Art");
await p.locator('[data-star="5"]').click();
await p.fill("#rvText", "Great service, testing the flow.");
await p.locator("#rvConsent").check();
await p.locator("#rvRights").check();
// attach a small png (1x1) as photo
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
await p.locator("#rvPhoto").setInputFiles({ name: "qa.png", mimeType: "image/png", buffer: png });
out.photoInfo = await p.evaluate(() => document.querySelector("#rvPhotoInfo").textContent);
out.previewShown = await p.evaluate(() => !document.querySelector("#rvPhotoPreview").hidden);
await p.click("#rvSubmit");
await p.waitForTimeout(2000);
out.statusShown = await p.evaluate(() => !document.querySelector("#rvStatus").hidden);
out.statusText = await p.evaluate(() => document.querySelector("#rvStatus").textContent);
out.nameAfterSubmit = await p.evaluate(() => document.querySelector("#rvName").value); // kept if failed
await p.click("#reviewFormClose");
await p.waitForTimeout(200);

// mobile overflow check for review section
const widths = [320, 360, 390, 430, 768, 1024, 1440];
out.overflow = {};
for (const w of widths) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.goto(url);
  await p.waitForTimeout(500);
  out.overflow[w] = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}
out.errors = errs;
console.log(JSON.stringify(out, null, 1));
await b.close();
