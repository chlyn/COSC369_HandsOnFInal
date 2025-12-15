import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("Logging in once for all tests...");

  // Login process
  await page.goto("https://grabdocs.com");
  await page.waitForLoadState("networkidle");
  await page.locator("text=Sign In").first().click();
  await page.waitForTimeout(1000);

  // Fill credentials
  await page
    .locator('input[name="username"], input[placeholder*="testuser"]')
    .fill("grabdocstesters");
  await page
    .locator('input[name="password"], input[type="password"]')
    .fill("Testing_123");

  // Sign in
  await page.locator('button:has-text("Sign in")').click();
  await page.waitForTimeout(2000);

  // Handle 2FA
  await page
    .locator(
      'input[name="code"], input[type="text"], input[placeholder*="code"]'
    )
    .fill("335577");
  await page
    .locator(
      'button:has-text("Verify"), button:has-text("Submit"), button[type="submit"]'
    )
    .click();
  await page.waitForTimeout(2000);

  // Wait for login
  await page.waitForURL("**/company", { timeout: 10000 });

  // Save the logged-in state
  await page.context().storageState({ path: "auth.json" });

  await browser.close();

  console.log("Login saved to auth.json");
}

// Run if executed directly
globalSetup();

export default globalSetup;
