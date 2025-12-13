// COMPANY MEMBERS E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login();
    cy.contains('button', /Members/i).click();

  });

  it('displays members information', () => {

    // Verifying header is present
    cy.contains(/Company Members/i).should('be.visible');

    // Verifying each input fields and buttons are present for company section
    cy.contains('button', /Invite Member/i).should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('select').contains('option', 'Member');
    cy.contains('button', /Invite/i).should('be.visible');

    // Verifying that admin is present in the member list
    cy.fixture('user').then((user) => {
      cy.contains(user.initials).should('be.visible');
      cy.contains(user.firstName).should('be.visible');
      cy.contains(user.lastName).should('be.visible');
      cy.contains(user.email).should('be.visible');
    });

  });

});