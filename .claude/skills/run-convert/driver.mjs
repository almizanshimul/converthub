// Smoke-test driver for the `convert` Next.js app.
// Drives the admin auth flow end-to-end with a real headless browser
// and saves a screenshot at each step. See SKILL.md in this folder.
//
// Usage (from anywhere, dev server must already be running):
//   node .claude/skills/run-convert/driver.mjs

import { chromium } from "playwright";
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SKILL_DIR, "../../..");
const SHOT_DIR = path.join(SKILL_DIR, "screenshots");

loadEnv({ path: path.join(PROJECT_ROOT, ".env") });

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env — run `npm run db:seed` first.");
  process.exit(1);
}

const consoleErrors = [];
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await (await browser.newContext()).newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));

const results = {};

try {
  // 1. Unauthenticated /admin must redirect to /admin/login
  await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
  results.step1_redirectToLogin = page.url();
  await page.screenshot({ path: path.join(SHOT_DIR, "1-login-page.png"), fullPage: true });
  if (!page.url().includes("/admin/login")) {
    throw new Error(`Expected redirect to /admin/login, got ${page.url()}`);
  }

  // 2. Log in with the seeded admin user
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await Promise.all([
    page.waitForURL(`${BASE}/admin`, { timeout: 15000 }),
    page.click('button[type="submit"]'),
  ]);
  results.step2_afterLogin = page.url();

  // 3. Dashboard should render stat cards
  await page.waitForSelector("text=Dashboard", { timeout: 10000 });
  const cardText = await page.locator("main").innerText();
  results.step3_hasLanguagesStat = cardText.includes("Languages");
  await page.screenshot({ path: path.join(SHOT_DIR, "2-dashboard.png"), fullPage: true });

  // 4. Sign out must clear the session and redirect to /admin/login
  await Promise.all([
    page.waitForURL(`${BASE}/admin/login`, { timeout: 15000 }),
    page.click('button:has-text("Sign out")'),
  ]);
  results.step4_afterSignOut = page.url();
  await page.screenshot({ path: path.join(SHOT_DIR, "3-after-signout.png"), fullPage: true });

  results.consoleErrors = consoleErrors;
  results.ok = consoleErrors.length === 0;
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
if (!results.ok) process.exit(1);
