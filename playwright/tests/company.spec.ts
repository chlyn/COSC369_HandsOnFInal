import { test, expect } from "@playwright/test";

test("Invite member to company", async ({ page }) => {
  // Navigate to company page
  await page.goto("https://app.grabdocs.com/company", {
    waitUntil: "load",
    timeout: 30000,
  });

  // Wait for company name to appear (sign that page loaded)
  await page.waitForSelector("text=Tester Grab Docs", { timeout: 15000 });

  console.log("✓ Company dashboard loaded");

  // Generate random email for the invite
  const randomNum = Math.floor(Math.random() * 10000);
  const inviteEmail = `member${randomNum}@example.com`;
  console.log("Will invite:", inviteEmail);

  // Navigate to Members tab
  await page.locator("text=Members").first().click();
  await page.waitForTimeout(1000);

  // Enter email in the invite field
  await page
    .locator('input[placeholder*="email@example.com"]')
    .fill(inviteEmail);

  // Click Invite button
  await page.getByRole("button", { name: "Invite", exact: true }).click();
  await page.waitForTimeout(2000);

  // Go to Invitations tab to verify
  await page.locator("text=Invitations").first().click();
  await page.waitForTimeout(1000);

  // Verify the invited email appears
  await expect(page.locator(`text=${inviteEmail}`).first()).toBeVisible();
  await expect(page.locator("text=Pending").first()).toBeVisible();

  console.log("✓ Member invited successfully!");
  console.log("✓ Email:", inviteEmail);
});
