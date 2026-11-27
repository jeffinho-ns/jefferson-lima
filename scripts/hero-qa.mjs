import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const out = path.resolve("docs/hero-qa");
fs.mkdirSync(out, { recursive: true });

const viewports = [
  [1920, 1080],
  [1440, 900],
  [1280, 720],
  [1024, 768],
  [768, 1024],
  [390, 844],
];

const browser = await chromium.launch();
for (const [w, h] of viewports) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.addInitScript(() => {
    sessionStorage.setItem("jt:preloader-seen", "1");
  });
  await page.goto("http://127.0.0.1:3000/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(1800);
  await page.evaluate(() => {
    document.body.classList.remove("preloader-active");
    document.querySelectorAll(".preloader").forEach((el) => el.remove());
  });
  await page.screenshot({
    path: path.join(out, `impl-${w}x${h}-natural.png`),
  });

  const target = page.locator("#hero canvas, #hero [data-digital-identity]").first();
  const box = await target.boundingBox().catch(() => null);
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.38);
    await page.waitForTimeout(900);
    await page.screenshot({
      path: path.join(out, `impl-${w}x${h}-decode.png`),
    });
    await page.mouse.move(10, 10);
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(out, `impl-${w}x${h}-return.png`),
    });
  }

  if (w === 1440) {
    await page
      .locator('button[aria-controls="site-navigation"]')
      .evaluate((el) => el.click());
    await page.waitForTimeout(900);
    await page.screenshot({
      path: path.join(out, `impl-${w}x${h}-menu.png`),
    });
  }
  await page.close();
  console.log("done", w, h);
}
await browser.close();
console.log("ALL_OK");
