const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://olympic-walker-performing-for.trycloudflare.com' || 'http://localhost:81',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});