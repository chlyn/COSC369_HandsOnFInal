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

  // Scenario where user views the file
  it('view file', () => {

    // Logging in with valid credentials
    loginToLinks();

    // Monitoring the backend API request and response
    cy.intercept('GET', '**api/v1/web/files/*/content').as('viewFile');

    // Viewing file by clicking "View File"
    cy.contains('tr', 'list-test.pdf')
      .within(() => {
        cy.get('button[title="View file"]').click();
      });

    // ERROR 
    // You cannot view the file, it always says "Error loading file"
    // Verifying that the backend receives and responds correctly
    cy.wait('@uploadFile').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/files');
      expect(request.method).to.eq('GET');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include({
        success: true
      });

    });
  
  });

  // Scenario where user downloads the file
  it('download file', () => {

    // Logging in with valid credentials
    loginToLinks();

    // Downloading file by clicking "Download File"
    cy.contains('tr', 'list-test.pdf')
      .within(() => {
        cy.get('button[title="Download file"]').click();
      });

    // ERROR
    // You cannot download a file, it always redirects you to a random page
    // Verifying that success message is present in the UI
    cy.contains(/File download started/i).should('be.visible').highlight();

  });

  // Scenario where the user deletes the file
  it('delete file', () => {

    // Logging in with valid credentials
    loginToLinks();

    // Monitoring the backend API request and response
    cy.intercept('DELETE', '**api/v1/web/files/*?confirmed=true').as('deleteFile');

    // Deleting file by clicking "Delete File"
    cy.contains('tr', 'list-test.pdf')
      .within(() => {
        cy.get('button[title="Delete file"]').click();
      });

    // Verifying that the backend receives and responds correctly
    cy.wait('@deleteFile').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/files');
      expect(request.method).to.eq('DELETE');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("deleted_file_info", "deletion_summary", "message", "success");
      expect(response.body).to.include({
        message: "⚠️ File 'list-test.pdf' has been PERMANENTLY deleted. This action is IRREVERSIBLE and cannot be undone.",
        success: true
      });

      // Verifying that the correct was deleted in the backend
      expect(response.body.deleted_file_info.original_filename).to.eq('list-test.pdf');

    });
  
    // Verifying that success message is present in the UI
    cy.contains(/File deleted successfully/i).should('be.visible').highlight();

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