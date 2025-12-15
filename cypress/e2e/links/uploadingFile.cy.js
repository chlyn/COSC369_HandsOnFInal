// UPLOADING A FILE E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.visit('/upload-to/toQTa4EKmhSbTlj-AmFyTu-sXmhKZCY2aHSmfhreQ98');
  
  });

  it('display upload file page', () => {

    // Verifying header is present
    cy.contains(/Upload Files/i).should('be.visible').highlight();

    // Verifying  buttons are present for upload links tab
    cy.contains(/Drop files here or click to browse/i).should('be.visible').highlight();
    cy.get('input[placeholder="Enter your name"]').should('be.visible').highlight();
    cy.get('input[type="email"]').should('be.visible').highlight();
    cy.get('textarea[placeholder="Add a note about these files..."]').should('be.visible').highlight();
    cy.get('input[placeholder="Enter action code if provided"]').should('be.visible').highlight();
    cy.contains('button', /Upload 0 Files/i).should('be.visible').and('be.disabled').highlight();

  });

});