// Importing custom Cypress commands so they are available in every test
import "./commands";

// Delaying tests by 700 milliseconds
const COMMAND_DELAY = 700;

// Listing specific commands to delay
const slowCommands = [
    "visit",
    "get",
    "contains",
    "click",
    "type",
    "clear",
    "select",
    "check",
    "uncheck"
];

// Looping through each command to delay
slowCommands.forEach((command) => {

    // Overwriting the original Cypress commands when called
    Cypress.Commands.overwrite(command, (originalFn, ...args) => {

        // Performing the real command action regularly 
        const result = originalFn(...args);

        // Waiting 700 milliseconds after the action is performed to run next command
        return new Cypress.Promise((resolve) => {
            setTimeout(() => {
                resolve(result);
            }, COMMAND_DELAY);
        });
    });
});
