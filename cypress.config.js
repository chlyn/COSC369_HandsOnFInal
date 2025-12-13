// Importing the cypress helper toolbto read the config correctly
const { defineConfig } = require("cypress");

// Exporting global variables for cypress to use
module.exports = defineConfig({
  e2e: {
    baseUrl: "https://app.grabdocs.com"     // Main website we will be testing
  },
});
