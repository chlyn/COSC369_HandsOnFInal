// UPLOAD LINKS E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/quick-links');
    cy.login();
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Quick Links/i).click();
  
  });

  it('display upload links tab', () => {

    // Verifying the user is taken to the correct page
    cy.url().should('match', /quick-links/i);

    // Verifying header is present
    cy.contains(/Quick Links/i).should('be.visible');

    // Verifying  buttons are present for upload links tab
    cy.contains('button', /New Link/).should('be.visible');

  });

});