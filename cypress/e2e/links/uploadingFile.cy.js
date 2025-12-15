// UPLOADING A FILE E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Visiting upload page before each test
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



// -------------------------------------------------------------------------------------------------------------------- 
// SUCCESS SCENARIOS 
// Verifying that users can upload a file

describe('Success Scenarios', () => {

  // Visiting upload page before each test
  beforeEach(() => {

    cy.visit('/upload-to/toQTa4EKmhSbTlj-AmFyTu-sXmhKZCY2aHSmfhreQ98');
  
  });

  it('upload file', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/upload-to/**').as('uploadFile');

    // Uploading file from fixture folder
    cy.contains(/Drop files here or click to browse/i).click();
    cy.get('input#file-upload').selectFile('cypress/fixtures/asset-upload-test.pdf', {force: true});

    // Filling in name field
    cy.getUser('user_2').then((user) => {
      cy.get('input[placeholder="Enter your name"]').type(user.firstName);
    });

    // Submitting upload file form by clicking "Upload 1 File"
    cy.contains('button', /Upload 1 File/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@uploadFile').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/upload-to/toQTa4EKmhSbTlj-AmFyTu-sXmhKZCY2aHSmfhreQ98');
      expect(request.method).to.eq('POST');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("errors", "message", "success", "uploaded_files");
      expect(response.body).to.include({
        message: 'Successfully uploaded 1 file(s)',
        success: true
      });

      // Verifying that the correct file is uploaded backend
      const uploadedFile = response.body.uploaded_files[0];
      expect(uploadedFile).to.include({
        filename: 'asset-upload-test.pdf',
        type: 'application/pdf'
      });

    });

    // Verifying that success message is present in the UI
    cy.contains(/Upload Complete!/i).should('be.visible').highlight();
  
  });

});