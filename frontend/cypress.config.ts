import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    env: {
      apiUrl: process.env.CYPRESS_API_URL || "http://localhost:8000",
    },
    video: false,
    retries: 1,
    setupNodeEvents() {
      // implement node event listeners here if needed
    },
  },
});
