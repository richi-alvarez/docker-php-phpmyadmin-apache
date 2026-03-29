const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://seeker-fellowship-invisible-quarterly.trycloudflare.com/es/' || 'http://localhost:8083',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});