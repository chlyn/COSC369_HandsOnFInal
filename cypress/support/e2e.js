// GLOBAL TESTS

// -------------------------------------------------------------------------------------------------------------------- 
// IMPORT
// Importing custom Cypress commands so they are available in every test

import "./commands";



// -------------------------------------------------------------------------------------------------------------------- 
// TEST DELAY 
// Delay in between tests

// How long the delay should be
const TEST_DELAY = 2000

// Pause before each test starts
beforeEach(() => {
    cy.wait(TEST_DELAY, { log: false });
});

// Pause after each test finishes (before the next test begins)
afterEach(() => {
    cy.wait(TEST_DELAY, { log: false });
});



// -------------------------------------------------------------------------------------------------------------------- 
// COMMAND DELAY 
// Delay in between action commands

// DHow long the delay should be
const COMMAND_DELAY = 800;

// Listing specific action commands to delay
const actionCommands = [
    "visit",
    "type",
    "clear",
    "select",
    "check",
    "uncheck",
];

// Looping through each action command to delay
actionCommands.forEach((command) => {

    // Overwriting the original Cypress action commands when called
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {

        // Performing the original action command regularly 
        const result = originalFn(...args);

        // Delyaing after the action is performed to run next command
        return new Cypress.Promise((resolve) => {
            setTimeout(() => {
                resolve(result);
            }, COMMAND_DELAY);
        });

    });

});



// -------------------------------------------------------------------------------------------------------------------- 
// HIGHLIGHT 
// Highlighting clicked elements in the UI for the demos

// CSS styles applied to the element during highlight
const CLICK_HIGHLIGHT_STYLE = "outline: 3px solid orange; background: rgba(255,165,0,0.18);";

// How long the hightlight should stay visible
const CLICK_HIGHLIGHT_MS = 300;

// Overwriting Cypress's built-in click command
Cypress.Commands.overwrite("click", (originalFn, subject, options) => {
   
    // If a valid element is being clicked, then apply highlight styles
    if (subject && subject.length) {

        // Looping through all matched elements (in case there are multiple)
        subject.each((_, el) => {

            // Store original style of the element
            const prev = el.getAttribute("style") || "";
            el.setAttribute("data-prev-style", prev);

            // Apply highlight style to the element
            el.setAttribute("style", `${prev}; ${CLICK_HIGHLIGHT_STYLE}`);

        });
    }

    // Pause briefly so the highlight is visible to the user after clicking
    return new Cypress.Promise((resolve) => setTimeout(resolve, CLICK_HIGHLIGHT_MS))
        .then(() => originalFn(subject, options))
        .then((result) => {

        // Restore the element's original styles after the click
        if (subject && subject.length) {
            subject.each((_, el) => {
                const prev = el.getAttribute("data-prev-style") || "";
                el.setAttribute("style", prev);
                el.removeAttribute("data-prev-style");
            });
        }

        // Add a delay after the click before the next command runs
        return new Cypress.Promise((resolve) => {
            setTimeout(() => resolve(result), COMMAND_DELAY);
        });
        
    });

});