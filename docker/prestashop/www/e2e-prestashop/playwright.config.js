const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://finding-gerald-way-tales.trycloudflare.com/en/' || 'http://localhost:8083',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});