import { test, expect } from "@playwright/test";

const FEEDBACK_URL = "https://app.grabdocs.com/feedback";

test("send support feedback", async ({ page }) => {
  // Go to feedback page
  await page.goto(FEEDBACK_URL);
  await page.waitForLoadState("load");

  await page.waitForTimeout(1000);

  await expect(page.getByText("Send Feedback")).toBeVisible({ timeout: 6000 });

  await page.waitForTimeout(1000);

  // Category dropdown
  const categorySelect = page.locator(
    "xpath=//label[normalize-space()='Category']/following::select[1]"
  );
  await expect(categorySelect).toBeVisible({ timeout: 6000 });

  // Choose the first real option (index 1)
  await categorySelect.selectOption({ index: 1 });

  await page.waitForTimeout(1000);

  // Fill in title and message
  const titleInput = page.getByPlaceholder("Brief summary of your feedback");
  const messageInput = page.getByPlaceholder(
    "Please provide detailed feedback..."
  );

  await expect(titleInput).toBeVisible({ timeout: 6000 });
  await expect(messageInput).toBeVisible({ timeout: 6000 });

  await page.waitForTimeout(500);
  await titleInput.fill("Test feedback");

  await page.waitForTimeout(500);
  await messageInput.fill("This is an automated test message.");

  await page.waitForTimeout(1000);

  // Submit Feedback
  const submitBtn = page.getByRole("button", { name: /submit feedback/i });
  await expect(submitBtn).toBeEnabled({ timeout: 6000 });

  await page.waitForTimeout(1000);
  await submitBtn.click();

  await page.waitForTimeout(2000);

  // Fail immediately if error toast appears
  const errorToast = page.getByText(/failed to submit feedback/i);
  const errorCount = await errorToast.count();
  if (errorCount > 0) {
    throw new Error(
      "ERROR: 'Failed to submit feedback' toast appeared — feedback submission did NOT succeed."
    );
  }

  // Assert success - look for "Thank you" or success message
  const successToast = page.getByText(/thank you for your feedback|success/i);
  await expect(successToast).toBeVisible({ timeout: 5000 });

  console.log("✓ Feedback submitted successfully!");

  await page.waitForTimeout(2000);
});
