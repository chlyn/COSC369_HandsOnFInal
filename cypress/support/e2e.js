// Importing custom Cypress commands so they are available in every test
import "./commands";

// Delaying tests by 700 milliseconds
const COMMAND_DELAY = 700;

// Listing specific action commands to delay
const actionCommands = [
    "visit",
    "click",
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

        // Waiting 700 milliseconds after the action is performed to run next command
        return new Cypress.Promise((resolve) => {
            setTimeout(() => {
                resolve(result);
            }, COMMAND_DELAY);
        });
    });
});