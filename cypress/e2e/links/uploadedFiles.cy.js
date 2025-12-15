// UPLOADED FILES E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login('user_1');
    cy.wait(2000);
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Quick Links/i).click();
    cy.contains('button', /Uploaded Files/i).click();
  
  });

  it('display uploaded files tab', () => {

    // Verifying the user is taken to the correct page
    cy.url().should('match', /quick-links/i);

    // Verifying header and sub-header are present
    cy.contains(/Quick Links/i).should('be.visible').highlight();
    cy.contains('h2', /Uploaded Files/).should('be.visible').highlight();

  });

});