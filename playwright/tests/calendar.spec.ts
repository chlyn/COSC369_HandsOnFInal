import { test, expect } from "@playwright/test";

const CALENDAR_URL = "https://app.grabdocs.com/calendar";
const CALENDAR_CREATE_URL = "https://app.grabdocs.com/calendar/create";

// Test 1: create an event
test("create calendar event", async ({ page }) => {
  await page.goto(CALENDAR_URL);
  await expect(page.getByText("My Calendar")).toBeVisible({ timeout: 6000 });

  await page.waitForTimeout(1000);

  // Go directly to the event-create page
  await page.goto(CALENDAR_CREATE_URL);
  await expect(page.getByText("Create New Event")).toBeVisible({
    timeout: 6000,
  });

  await page.waitForTimeout(1000);

  // Create unique event name with timestamp
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "-");
  const eventName = `Test Event ${timestamp}`;

  await page
    .getByPlaceholder("Team Meeting, Client Call, etc.")
    .fill(eventName);

  await page.waitForTimeout(1000);

  // Click "Create Event"
  const createBtn = page.getByRole("button", { name: /create event/i });
  await expect(createBtn).toBeVisible({ timeout: 6000 });
  await createBtn.click();

  await page.waitForTimeout(2000);

  // Go back to the calendar view and verify the event is visible
  await page.goto(CALENDAR_URL);
  await expect(page.getByText(eventName)).toBeVisible({ timeout: 10000 });

  console.log(`✓ Event created successfully: ${eventName}`);
});
