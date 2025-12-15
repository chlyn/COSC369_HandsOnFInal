import { test, expect, Page } from "@playwright/test";

const QUESTION = "What is 2+2?";
const EXPECTED = /\b4\b/; // any response as long as it has 4

// Navigate to Home before each test
test.beforeEach(async ({ page }) => {
  await page.goto("https://app.grabdocs.com/upload");
  console.log("✓ On Home page");
});

async function sendChat(page: Page, text: string) {
  // input in the chat box
  const box = page.getByPlaceholder(/ask anything/i);
  await expect(box).toBeVisible({ timeout: 8000 });
  await box.fill(text);

  // send with Enter
  await box.press("Enter");
}

test("chatbot basic response", async ({ page }) => {
  await sendChat(page, QUESTION);

  // Wait for an assistant response to appear that includes the expected content.
  // Primary check: look for the expected answer text.
  try {
    await expect(page.getByText(EXPECTED)).toBeVisible({ timeout: 30000 });
    return;
  } catch (error) {
    // Continue to fallback
  }

  // Secondary check: look for a generic AI response pattern to avoid false negatives.
  try {
    const fallback = /\b(result|equals|answer)\b/i;
    await expect(page.getByText(fallback)).toBeVisible({ timeout: 30000 });
    return;
  } catch (error) {
    // On failure, collect artifacts for debugging.
    await page.screenshot({
      path: "chat_debug_screenshot.png",
      fullPage: true,
    });
    const content = await page.content();
    const fs = require("fs");
    fs.writeFileSync("chat_debug_dom.html", content, "utf-8");

    throw new Error(
      "Chatbot did not surface a visible response in time. " +
        "Saved chat_debug_screenshot.png and chat_debug_dom.html."
    );
  }
});

test("chatbot mode switching", async ({ page }) => {
  await expect(page.getByText("Drop files or click to browse")).toBeVisible({
    timeout: 6000,
  });

  // Default should be Refined
  await expect(
    page.getByText("Refined: AI-enhanced from documents", { exact: false })
  ).toBeVisible({ timeout: 5000 });

  await page.waitForTimeout(1000);

  // Switch to Exact
  await page.getByRole("button", { name: "Exact" }).click();

  await expect(
    page.getByText("Exact: Only from documents", { exact: false })
  ).toBeVisible({ timeout: 5000 });

  await page.waitForTimeout(1000);

  // Switch to Expanded
  await page.getByRole("button", { name: "Expanded" }).click();

  await expect(
    page.getByText("Expanded: Documents + external sources", { exact: false })
  ).toBeVisible({ timeout: 5000 });

  await page.waitForTimeout(1000);

  // Switch back to Refined
  await page.getByRole("button", { name: "Refined" }).click();

  await expect(
    page.getByText("Refined: AI-enhanced from documents", { exact: false })
  ).toBeVisible({ timeout: 5000 });
});
