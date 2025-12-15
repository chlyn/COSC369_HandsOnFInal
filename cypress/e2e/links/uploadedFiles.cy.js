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



// -------------------------------------------------------------------------------------------------------------------- 
// SUCCESS SCENARIOS 
// Verifying that the files are listed and that users can view, download, and delete a file.

describe('Success Scenarios', () => {

  // Scenario where the files are listed in the uploaded files tab
  it('list files', () => {

    // Uploading a file
    uploadFile();

    // Monitoring the backend API request and response
    cy.intercept('GET', '**api/v1/web/files/uploaded-via-links').as('listUploadedFiles');
    cy.intercept('GET', '**api/v1/web/files').as('listQuickFiles');
    
    // Logging in with valid credentials
    loginToLinks();

    // Verifying that the backend receives and responds correctly
    cy.wait('@listUploadedFiles').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/files/uploaded-via-links');
      expect(request.method).to.eq('GET');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("count", "files", "message", "success");
      expect(response.body).to.include({
        message: 'Files uploaded via links',
        success: true
      });

      // Verifying that the file is listed properly in the backend for uploaded files
      expect(response.body.files[0].original_filename).to.eq('list-test.pdf');

    });

    // Verifying that the file is listed in the UI for uploaded files
    cy.contains('list-test.pdf').should('be.visible').highlight();

    // Going to Quick Files page
    goToFiles();

    // Verifying that the backend receives and responds correctly
    cy.wait('@listQuickFiles').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/files');
      expect(request.method).to.eq('GET');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("files", "success");
      expect(response.body).to.include({
        success: true
      });

      // Verifying that the file is listed properly in the backend for quick files
      expect(response.body.files[0].original_filename).to.eq('list-test.pdf');

    });

    // Verifying that the file is listed in the UI for quick files
    cy.contains('list-test').should('be.visible').highlight();

  });

});



// -------------------------------------------------------------------------------------------------------------------- 
// HELPER FUNCTIONS 

// Logging user and going to Quick Links page
export const loginToLinks = () => {

  cy.login('user_1');
  cy.wait(2000);
  cy.get('button[title="Quick Apps"]').click();
  cy.contains(/Quick Links/i).click();
  cy.contains('button', /Uploaded Files/i).click();
  
};

// Going to Quick Files page
export const goToFiles = () => {

  cy.get('button[title="Quick Apps"]').click();
  cy.contains(/Files/i).click();
  
};

// Uploading files into upload page
export const uploadFile = () => {

  // Visiting upload page
  cy.visit('/upload-to/YjY7tDyxv-5_vCKfXVEj7MmsGy3WXnMscUikE5OH_R8');

  // Uploading file from fixture assets folder  
  cy.contains(/Drop files here or click to browse/i).click();
  cy.get('input#file-upload').selectFile('cypress/fixtures/assets/list-test.pdf', {force: true});

  // Filling in name field
  cy.getUser('user_2').then((user) => {
    cy.get('input[placeholder="Enter your name"]').type(user.firstName);
  });

  // Submitting upload file form by clicking "Upload 1 File"
  cy.contains('button', /Upload 1 File/i).click();
  
};