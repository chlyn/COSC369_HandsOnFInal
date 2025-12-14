// COMPANY OVERVIEW E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login('user_1');

  });

  // Verifying that all page elements are rendered into the page
  it('displays overview information', () => {

    // Verifying header is present
    cy.contains(/Company Overview/i).should('be.visible').highlight();

    // Verifying key company account information are present
    cy.contains(/Total Members/i).should('be.visible').highlight();
    cy.contains(/Workspaces/i).should('be.visible').highlight();
    cy.contains(/Subscription Tier/i).should('be.visible').highlight();

    // Verifying main company credentials are present
    cy.getCompany().then((company) => {
      cy.contains(company.name).should('be.visible').highlight();
      cy.contains(company.email).should('be.visible').highlight();
      cy.contains(company.website).should('be.visible').highlight();
    });

  });

});