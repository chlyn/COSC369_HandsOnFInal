// REUSABLE COMMANDS

// -------------------------------------------------------------------------------------------------------------------- 
// LOGIN 
// Logging in users with valid credentials

Cypress.Commands.add('login', (userKey) => {

    // Visiting login page
    cy.visit("/login");

    // Loading user credentials and OTP bypass from user fixture file
    cy.fixture('users').then((users) => {

        const user = users[userKey];

        // Filling out the login form with valid credentials
        cy.get('input[name="username"]').type(user.username);
        cy.get('input[name="password"]').type(user.password);

        // Submiting the login form by selecting "Sign in"
        cy.contains('button', /Sign in/i).click();

        // Filling out verification form with OTP bypass
        cy.get('input[name="otpCode"]').type(user.otpBypass);

        // Submiting the verification form by selecting "Verify Code"
        cy.contains('button', /Verify Code/i).click();

    });

}); 



// -------------------------------------------------------------------------------------------------------------------- 
// GET INFORMATION 
// Getting user and company information from fixtures folder

// Loading specific user information
Cypress.Commands.add('getUser', (key) => {
    return cy.fixture('users').then(users => users[key]);
});

// Loading company information
Cypress.Commands.add('getCompany', () => {
    return cy.fixture('company');
});



// -------------------------------------------------------------------------------------------------------------------- 
// HIGHLIGHT
// Highlighting elements in the UI for the demos

// CSS styles applied to the element during highlight
const HIGHLIGHT_STYLE = "outline: 3px solid #00c2ff; background: rgba(0,194,255,0.15);";

// How long the hightlight should stay visible
const HIGHLIGHT_MS = 500;

Cypress.Commands.add("highlight", { prevSubject: "element" }, ($el) => {

    // Looping through all matched elements (in case there are multiple)
    $el.each((_, el) => {

        // Store original style of the element
        const prev = el.getAttribute("style") || "";
        el.setAttribute("data-prev-style", prev);

        // Apply highlight style to the element 
        el.setAttribute("style", `${prev}; ${HIGHLIGHT_STYLE}`);

    });

    // Pause briefly so the highlight is visible to the user theb restore the original styles
    return cy.wait(HIGHLIGHT_MS, { log: false }).then(() => {
        $el.each((_, el) => {
            const prev = el.getAttribute("data-prev-style") || "";
            el.setAttribute("style", prev);
            el.removeAttribute("data-prev-style");
        });
        return $el;
    });

});