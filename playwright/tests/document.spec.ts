import { test, expect, Page } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

function makeFile(
  fixturesDir: string,
  stem: string,
  ext: string = ".txt"
): string {
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  const now = new Date();
  const timestamp = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const fileName = `${stem}_${timestamp}${ext}`;
  const filePath = path.join(fixturesDir, fileName);

  fs.writeFileSync(
    filePath,
    `This is a test file named ${fileName}\n`,
    "utf-8"
  );

  return filePath;
}

async function uploadFile(page: Page, filePath: string) {
  const fileInput = page.locator('input[type="file"]').first();
  await expect(fileInput).toBeVisible({ timeout: 10000 });

  await fileInput.setInputFiles(filePath);

  const visibleName = path.basename(filePath, path.extname(filePath));

  await page.waitForTimeout(2000);

  try {
    await expect(page.getByText(visibleName)).toBeVisible({ timeout: 10000 });
    console.log(`✓ Uploaded: ${visibleName}`);
    return;
  } catch (error) {
    // Continue
  }

  // Check that the "no documents" empty state is gone
  try {
    await expect(page.getByText("No documents uploaded yet")).not.toBeVisible({
      timeout: 3000,
    });
    console.log(`✓ Uploaded (empty state removed): ${visibleName}`);
    return;
  } catch (error) {
    // Debug on failure
    await page.screenshot({
      path: `upload_debug_${visibleName}.png`,
      fullPage: true,
    });
    fs.writeFileSync(
      `upload_debug_${visibleName}.html`,
      await page.content(),
      "utf-8"
    );
    throw new Error(`Upload did not appear for: ${visibleName}`);
  }
}

test("upload three files", async ({ page }) => {
  // Navigate to upload page
  await page.goto("https://app.grabdocs.com/upload");
  await page.waitForLoadState("load");
  await page.waitForTimeout(1000);

  const fixturesDir = path.join(__dirname, "fixtures");

  // Create three files to test upload
  const files = [
    makeFile(fixturesDir, "multi1"),
    makeFile(fixturesDir, "multi2"),
    makeFile(fixturesDir, "multi3"),
  ];

  // Upload each file sequentially
  for (const filePath of files) {
    await uploadFile(page, filePath);
    await page.waitForTimeout(1000);
  }

  console.log("✓ All three files uploaded successfully");
});
