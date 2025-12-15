import { test, expect } from "@playwright/test";

test("Sign up for company account", async ({ page }) => {
  // Generate random company name and user info
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  const companyName = `Test Company ${timestamp}`;
  const username = `testuser${randomNum}`;
  const email = `testuser${randomNum}@example.com`;
  const companyEmail = `company${randomNum}@example.com`;

  console.log("Creating company:", companyName);
  console.log("Username:", username);

  // Step 1: Go to homepage and click Sign In
  await page.goto("https://grabdocs.com");
  await page.waitForLoadState("networkidle");
  await page.locator("text=Sign In").first().click();
  await page.waitForTimeout(1000);

  // Step 2: Click "Sign up" link
  await page.locator("text=Sign up").click();
  await page.waitForTimeout(1000);

  // Step 3: Click "Sign up for my company" button
  await page.locator("text=Sign up for my company").click();
  await page.waitForTimeout(1000);

  // Step 4: Fill out company information form
  // Company Code
  await page
    .locator(
      'input[name="companyCode"], input[placeholder*="company signup code"]'
    )
    .fill("default-company-code-2024");

  // Company Phone
  await page
    .locator('input[name="companyPhone"], input[placeholder*="234 567 8900"]')
    .fill("15623478900");

  // Company Name
  await page
    .locator(
      'input[name="companyName"], input[placeholder*="Acme Corporation"]'
    )
    .fill(companyName);

  // Company Email
  await page
    .locator(
      'input[name="companyEmail"], input[placeholder*="contact@company.com"]'
    )
    .fill(companyEmail);

  // Company Website
  await page
    .locator(
      'input[name="companyWebsite"], input[placeholder*="https://company.com"]'
    )
    .fill("https://testcompany.com");

  // Step 5: Fill out admin account information
  // First Name
  await page
    .locator('input[name="firstName"], input[placeholder*="John"]')
    .fill("Test");

  // Last Name
  await page
    .locator('input[name="lastName"], input[placeholder*="Doe"]')
    .fill("User");

  // Email
  await page
    .locator('input[name="email"], input[placeholder*="john@company.com"]')
    .fill(email);

  // Username
  await page
    .locator('input[name="username"], input[placeholder*="johndoe"]')
    .fill(username);

  // Password
  await page
    .locator(
      'input[name="password"], input[placeholder*="Create a strong password"]'
    )
    .fill("TestPassword123!");

  // Confirm Password
  await page
    .locator(
      'input[name="confirmPassword"], input[placeholder*="Confirm your password"]'
    )
    .fill("TestPassword123!");

  // Step 6: Click Create Company & Account button
  await page.locator('button:has-text("Create Company & Account")').click();

  await page.waitForTimeout(3000);

  // Step 7: Verify we're on the company dashboard
  await page.waitForURL("**/company?welcome=true", { timeout: 10000 });

  // Check for success message
  const successMessage = page.locator(
    "text=Welcome! Your company has been created successfully"
  );
  await expect(successMessage).toBeVisible({ timeout: 10000 });

  // Verify company name appears on dashboard
  await expect(page.locator(`text=${companyName}`).first()).toBeVisible();

  // Check for Company Dashboard heading
  await expect(page.locator("text=Company Dashboard")).toBeVisible();

  // Verify tabs are present (Overview, Members, Invitations, Settings)
  await expect(page.locator("text=Overview").first()).toBeVisible();
  await expect(page.locator("text=Members").first()).toBeVisible();

  console.log("✓ Company account created successfully!");
  console.log("✓ Company name:", companyName);
  console.log("✓ Username:", username);
  console.log("✓ Dashboard loaded successfully");
});

test("Login with company account", async ({ page }) => {
  // Company account credentials
  const username = "grabdocstesters";
  const password = "Testing_123";

  console.log("Logging in with username:", username);

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
  // Enter the bypass code
  await page
    .locator(
      'input[name="code"], input[type="text"], input[placeholder*="code"]'
    )
    .fill("335577");

  // Click verify/submit button
  await page
    .locator(
      'button:has-text("Verify"), button:has-text("Submit"), button[type="submit"]'
    )
    .click();

  await page.waitForTimeout(3000);

  // Step 6: Verify we're logged in - check for company dashboard
  await page.waitForURL("**/company", { timeout: 10000 });

  // Verify company name appears on dashboard
  await expect(page.locator("text=Tester Grab Docs").first()).toBeVisible();

  // Check for Company Dashboard heading
  await expect(page.locator("text=Company Dashboard")).toBeVisible();

  // Verify tabs are present
  await expect(page.locator("text=Overview").first()).toBeVisible();
  await expect(page.locator("text=Members").first()).toBeVisible();

  console.log("✓ Successfully logged in!");
  console.log("✓ Company dashboard loaded");
});
