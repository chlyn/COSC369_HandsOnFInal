// COMPANY INVITATIONS E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login('user_1');
    cy.contains('button', /Invitations/i).click();

  });

  // Verifying that all page elements are rendered into the page
  it('displays invitations information', () => {

    // Verifying header is present
    cy.contains(/Pending Invitations/i).should('be.visible').highlight();

  });

});