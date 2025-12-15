import { test, expect } from "@playwright/test";

// This runs before each test
test.beforeEach(async ({ page }) => {
  const username = "grabdocstesters";
  const password = "Testing_123";

  console.log("Logging in...");

  // Step 1: Go to homepage and click Sign In
  await page.goto("https://grabdocs.com");
  await page.waitForLoadState("networkidle");
  await page.locator("text=Sign In").first().click();
  await page.waitForTimeout(1000);

  // Step 2: Fill in credentials
  await page
    .locator('input[name="username"], input[placeholder*="testuser"]')
    .fill(username);
  await page
    .locator('input[name="password"], input[type="password"]')
    .fill(password);

  // Step 3: Click Sign in
  await page.locator('button:has-text("Sign in")').click();
  await page.waitForTimeout(2000);

  // Step 4: Handle 2FA
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

  // Wait for dashboard to load
  await page.waitForURL("**/company", { timeout: 10000 });
  console.log("✓ Logged in successfully");
});

test("Invite member to company", async ({ page }) => {
  // Company account credentials
  const username = "grabdocstesters";
  const password = "Testing_123";

  // Generate random email for the invite
  const randomNum = Math.floor(Math.random() * 10000);
  const inviteEmail = `member${randomNum}@example.com`;

  console.log("Logging in with username:", username);
  console.log("Will invite:", inviteEmail);

  // Step 1: Go to homepage and click Sign In
  await page.goto("https://grabdocs.com");
  await page.waitForLoadState("networkidle");
  await page.locator("text=Sign In").first().click();
  await page.waitForTimeout(1000);

  // Step 2: Fill in username
  await page
    .locator('input[name="username"], input[placeholder*="testuser"]')
    .fill(username);

  // Step 3: Fill in password
  await page
    .locator('input[name="password"], input[type="password"]')
    .fill(password);

  // Step 4: Click Sign in button
  await page.locator('button:has-text("Sign in")').click();

  await page.waitForTimeout(2000);

  // Step 5: Handle two-factor authentication
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

  await page.waitForTimeout(3000);

  // Step 6: Navigate to Members tab
  await page.locator("text=Members").first().click();
  await page.waitForTimeout(1000);

  // Step 7: Enter email in the invite field
  await page
    .locator('input[placeholder*="email@example.com"]')
    .fill(inviteEmail);

  // Step 8: Click Invite button (the one next to the email field, not "Invite Member")
  await page.getByRole("button", { name: "Invite", exact: true }).click();

  await page.waitForTimeout(2000);

  // Step 9: Go to Invitations tab to verify the invite was sent
  await page.locator("text=Invitations").first().click();
  await page.waitForTimeout(1000);

  // Step 10: Verify the invited email appears in Pending Invitations
  await expect(page.locator(`text=${inviteEmail}`).first()).toBeVisible();
  await expect(page.locator("text=Pending").first()).toBeVisible();

  console.log("✓ Member invited successfully!");
  console.log("✓ Email:", inviteEmail);
  console.log("✓ Invitation confirmed in Invitations tab");
});
