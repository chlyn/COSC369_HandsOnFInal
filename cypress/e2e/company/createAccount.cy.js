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



// -------------------------------------------------------------------------------------------------------------------- 
// SUCCESS SCENARIOS 
// Verifying that the user can create a company account and login

describe('Success Scenarios', () => {

  // Visiting the signup page before each test
  beforeEach(() => {

    cy.visit('/signup'); 
    cy.contains(/Sign up for my company/i).click();

  });

  // Creating account using given form
  it('standard setup', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/signup/company').as('createAccount');

    // Generating unique credentials to create new accounts
    const unique = Date.now().toString();
    const company_name = unique + ' Company';
    const company_website = 'https://' + unique + '.com';
    const username = unique;
    const email = unique + '@example.com';

    // Filling out the form with valid company information
    cy.get('input[id="company_code"]').type('default-company-code-2024');
    cy.get('input[id="company_phone"]').type('5623478900');
    cy.get('input[id="company_name"]').type(company_name);
    cy.get('input[id="company_email"]').type(email);
    cy.get('input[id="company_website"]').type(company_website);

    // Filling out the form with valid user credentials
    cy.get('input[id="admin_firstName"]').type('Create');
    cy.get('input[id="admin_lastName"]').type('Account');
    cy.get('input[id="admin_email"]').type(email);
    cy.get('input[id="admin_username"]').type(username);
    cy.get('input[id="admin_password"]').type('Testing_123');
    cy.get('input[id="confirmPassword"]').type('Testing_123');

    // Submiting the form by selecting "Create Account"
    cy.contains('button', /Create Company & Account/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createAccount').then(({request, response}) => {

      // Verifying the correct API endpoint, HTTP method, email, and username was used for the request
      expect(request.url).to.include('/api/v1/web/signup/company');
      expect(request.method).to.eq('POST');
      expect(request.body).to.include({
        admin_email: email,
        admin_username: username
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("company", "user", "message", "success");
      expect(response.body).to.include({
        message: 'Company and admin account created successfully',
        success: true
      });

    });

    // Verifying that success message is present in the UI
    cy.contains(/Company and admin account created successfully!/i).should('be.visible');

    // Verifying that user is takin to the company dashboard
    cy.url().should("include", "/company?welcome=true");
    cy.contains(company_name).should('be.visible');
    cy.contains(/Company Dashboard/i).should('be.visible');

  });

});