// COMPANY OVERVIEW E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login();

  });

  it('displays overview information', () => {

    // Verifying header is present
    cy.contains(/Company Overview/i).should('be.visible');

    // Verifying key company account information are present
    cy.contains(/Total Members/i).should('be.visible');
    cy.contains(/Workspaces/i).should('be.visible');
    cy.contains(/Subscription Tier/i).should('be.visible');

    // Verifying main company credentials are present
    cy.fixture('company').then((company) => {
      cy.contains(company.name).should('be.visible');
      cy.contains(company.email).should('be.visible');
      cy.contains(company.website).should('be.visible');
    });

  });

});