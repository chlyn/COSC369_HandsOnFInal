import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "https://grabdocs.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
  },

  projects: [
    // Tests that need to be logged OUT (authentication tests)
    {
      name: "logged-out",
      testMatch: "**/authentication.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // Tests that need to be logged IN (all other tests)
    {
      name: "logged-in",
      testMatch: "**/*.spec.ts",
      testIgnore: "**/authentication.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./playwright/auth.json",
      },
    },
  ],
});
