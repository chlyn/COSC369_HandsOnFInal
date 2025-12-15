import { test, expect } from "@playwright/test";

const REACH_URL = "https://app.grabdocs.com/video-meeting";

test("create and delete meeting", async ({ page }) => {
  // Go to video meeting page
  await page.goto(REACH_URL);
  await page.waitForLoadState("load");

  await page.waitForTimeout(1000);

  // Create a meeting with timestamp
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "-");
  const meetingName = `pw-meet-${timestamp}`;

  console.log(`Creating meeting: ${meetingName}`);

  await page.waitForTimeout(1000);

  // Click Create Meeting button
  await page.getByRole("button", { name: /^create\s+meeting$/i }).click();

  await page.waitForTimeout(1000);

  // Fill in meeting name
  await page.getByPlaceholder(/enter\s+meeting\s+name/i).fill(meetingName);

  await page.waitForTimeout(1000);

  // Click Create Meeting button in the dialog (second occurrence)
  await page
    .getByRole("button", { name: /^create\s+meeting$/i })
    .nth(1)
    .click();

  await page.waitForTimeout(2000);

  // Wait for success toast
  await expect(page.getByText(/meeting created successfully/i)).toBeVisible({
    timeout: 8000,
  });

  console.log(`✓ Meeting created: ${meetingName}`);

  await page.waitForTimeout(1000);

  // Find DELETE button for THIS meeting using XPath
  const deleteBtn = page.locator(
    `xpath=(//*[contains(text(), '${meetingName}')]/following::button[contains(@title, 'Delete')])[1]`
  );

  await expect(deleteBtn).toBeVisible({ timeout: 8000 });

  await page.waitForTimeout(1000);

  await deleteBtn.click();

  await page.waitForTimeout(2000);

  // Make sure the meeting card is gone
  await expect(page.getByText(meetingName)).not.toBeVisible({ timeout: 8000 });

  console.log(`✓ Meeting deleted: ${meetingName}`);
});
