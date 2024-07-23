const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // your existing configuration options here
  chromeWebSecurity: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
