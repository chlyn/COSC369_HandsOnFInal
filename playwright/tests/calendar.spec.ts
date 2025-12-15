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

// Test 2: Create then delete an event
test("create and delete calendar event", async ({ page }) => {
  await page.goto(CALENDAR_URL);
  await expect(page.getByText("My Calendar")).toBeVisible({ timeout: 6000 });

  await page.waitForTimeout(1000);

  // Create an event first
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
  const eventName = `Test Delete Event ${timestamp}`;

  await page
    .getByPlaceholder("Team Meeting, Client Call, etc.")
    .fill(eventName);

  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: /create event/i }).click();

  await page.waitForTimeout(2000);

  console.log(`✓ Event created: ${eventName}`);

  // Open the event from Total Events
  await page.goto(CALENDAR_URL);
  await page.waitForTimeout(1000);

  await page.getByText("Total Events").click();
  await page.waitForTimeout(1000);

  await expect(page.getByText(eventName)).toBeVisible({ timeout: 8000 });
  await page.getByText(eventName).click();

  await page.waitForTimeout(2000);

  // Wait to be on the event details page
  await page.waitForURL(/\/calendar\/event\/\d+/);

  // The delete button is the one with the trash icon and red border
  const deleteBtn = page
    .locator("button")
    .filter({
      has: page.locator("svg"),
    })
    .nth(3);

  await deleteBtn.click();

  await page.waitForTimeout(2000);

  // Confirm delete if dialog pops up - wait longer for it
  try {
    const confirmBtn = page.getByRole("button", { name: /delete|confirm/i });
    await confirmBtn.waitFor({ state: "visible", timeout: 5000 });
    await confirmBtn.click();
    console.log("✓ Clicked confirmation button");
  } catch (error) {
    console.log("No confirmation dialog appeared");
  }

  await page.waitForTimeout(3000);

  // Make sure it's gone
  await page.goto(CALENDAR_URL);
  await page.waitForTimeout(1000);

  await page.getByText("Total Events").click();
  await page.waitForTimeout(1000);

  await expect(page.getByText(eventName)).not.toBeVisible({ timeout: 8000 });

  console.log(`✓ Event deleted successfully: ${eventName}`);
});

// Test 3: Calendar next month navigation
test("calendar next button changes month", async ({ page }) => {
  await page.goto(CALENDAR_URL);
  await expect(page.getByText("My Calendar")).toBeVisible({ timeout: 6000 });

  await page.waitForTimeout(1000);

  // Grab the current month header text
  const monthHeader = page.locator("text=/^[A-Za-z]+ \\d{4}$/").first();
  const initialText = await monthHeader.innerText();

  await page.waitForTimeout(1000);

  // Click the "Next" button
  await page.getByRole("button", { name: "Next" }).click();

  await page.waitForTimeout(1000);

  // Assert the month header text is now different
  await expect(monthHeader).not.toHaveText(initialText);

  console.log(`✓ Month changed from "${initialText}" to a different month`);
});
