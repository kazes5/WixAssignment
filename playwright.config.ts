import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load WIX_API_KEY and WIX_ACCOUNT_ID from .env into process.env (the file is gitignored).
// `quiet` stops dotenv from printing anything to the console.
dotenv.config({ quiet: true });

export default defineConfig({
  testDir: './tests',
  // Live third-party pages: give each test room for slow results (taken names took ~8 s manually).
  timeout: 60_000,
  expect: { timeout: 20_000 },
  // One retry absorbs a rare network hiccup; a real failure still fails twice and is reported.
  retries: 1,
  // Few workers on purpose: we are guests on wix.com and the API budget is small.
  workers: 2,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  projects: [
    {
      // Public Domain Search API. No browser needed.
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://www.wixapis.com',
        // Traces record request headers, which would include the API key. Keep them off here.
        trace: 'off',
      },
    },
    {
      // Domain storefront web door, logged out (public pages only).
      name: 'web',
      testDir: './tests/web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.wix.com',
        locale: 'en-US',
        screenshot: 'only-on-failure',
        // Browser traces only contain wix.com traffic (no API key), so they are safe to keep on failure.
        trace: 'retain-on-failure',
      },
    },
    {
      // Cross-door checks: the same name through the API and the storefront.
      name: 'cross',
      testDir: './tests/cross',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.wix.com',
        locale: 'en-US',
        screenshot: 'only-on-failure',
        // This project also calls the API with the key, so no traces (they would capture the header).
        trace: 'off',
      },
    },
  ],
});
