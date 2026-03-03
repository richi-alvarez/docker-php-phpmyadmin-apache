const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://331a-2800-e2-57f-ffac-2e99-a097-9672-337b.ngrok-free.app' || 'http://localhost:81',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
