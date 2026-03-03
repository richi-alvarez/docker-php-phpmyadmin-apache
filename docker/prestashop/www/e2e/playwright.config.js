const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://week-vertex-catalogs-defines.trycloudflare.com/en/' || 'http://localhost:81',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});