// CREATE COMPANY ACCOUNT E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Visiting the signup page before each test
  beforeEach(() => {

    // // ERROR
    // // The url "https://app.grabdocs.com/signup/company" does not take you directly to the specified page 
    // // It takes you to "https://app.grabdocs.com/login" instead and you have to manually click to /signup/company
    // cy.visit('/signup/company'); 

    cy.visit('/signup'); 
    cy.contains(/Sign up for my company/i).click();

  });

  it('displays the create company form', () => {

    // Verifying each input fields are present for company section
    cy.get('input[id="company_code"]').should('be.visible');
    cy.get('input[id="company_phone"]').should('be.visible');
    cy.get('input[id="company_name"]').should('be.visible');
    cy.get('input[id="company_email"]').should('be.visible');
    cy.get('input[id="company_website"]').should('be.visible');

    // Verifying each input fields are present for admin section
    cy.get('input[id="admin_firstName"]').should('be.visible');
    cy.get('input[id="admin_lastName"]').should('be.visible');
    cy.get('input[id="admin_email"]').should('be.visible');
    cy.get('input[id="admin_username"]').should('be.visible');
    cy.get('input[id="admin_password"]').should('be.visible');
    cy.get('input[id="confirmPassword"]').should('be.visible');

    // Verifying submiy button is present
    cy.contains('button', /Create Company & Account/i).should('be.visible');

    // Verifying other links related to account signin are present
    cy.contains(/Sign in/i).should('be.visible');
    cy.contains(/Sign up for free/i).should('be.visible');

  });

});