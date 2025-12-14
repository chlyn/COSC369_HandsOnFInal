// UPLOAD LINKS E2E TEST

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
  
  });

  it('display upload links tab', () => {

    // Verifying the user is taken to the correct page
    cy.url().should('match', /quick-links/i);

    // Verifying header is present
    cy.contains(/Quick Links/i).should('be.visible').highlight();

    // Verifying  buttons are present for upload links tab
    cy.contains('button', /New Link/).should('be.visible').highlight();

  });

});



// -------------------------------------------------------------------------------------------------------------------- 
// SUCCESS SCENARIOS 
// Verifying that users can create a new link

describe('Success Scenarios', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login('user_1');
    cy.wait(2000);
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Quick Links/i).click();

  });

  // Scenario where user creates a new liink
  it('create link', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/upload-links').as('createLink');

    // Creating new link by clicking "New Link" button
    cy.contains('button', /New Link/i).click();

    // Verifying create link form is present
    cy.contains(/Create Upload Link/i).should('be.visible');

    // Filling out link name field
    cy.get('input[placeholder="Enter link name"]').type('Testing Link');

    // Submitting create link form by clicking "Create Link" button 
    cy.contains('button', /Create Link/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createLink').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('api/v1/web/upload-links');
      expect(request.method).to.eq('POST');
      expect(request.body).to.include({
        link_name: 'Testing Link'
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include({
        message: 'Upload link created successfully',
        success: true
      });

    });

    // Verifying that success message is present in the UI
    cy.contains(/Upload link created successfully/i).should('be.visible').highlight();

  });

  // Scenario where user shares a link
  it('share link', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/upload-links/*/send-email').as('shareLink');

    // Ignore errors for using clipboard
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('writeText') && err.message.includes('Clipboard')) {
        return false;
      }
    });

    // Going to more actions 
    cy.contains('td', 'Testing Link')
      .parent('tr')
      .find('button[aria-label="Options"]')
      .click();

    // Sharing link by clicking "Share"
    cy.contains('button', /Share/i).click();

    // Verifying share link form is present
    cy.contains(/Share Upload Link/i).should('be.visible').highlight();

    // Filling out email field
    cy.getUser('user_2').then((user) => {
      cy.get('textarea[placeholder*="recipient1@example.com"]').type(user.email);
    });

    // Submitting share link form by clicking "Copy Link"
    cy.contains('button', /Send Email/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@shareLink').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/upload-links/');
      expect(request.method).to.eq('POST');

      // Verifying that the invitation is listed properly in the backend
      cy.getUser('user_2').then((user) => {
        expect(request.body.recipient_emails[0]).to.eq(user.email);;
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include({
        message: 'Email sent successfully to 1 recipient(s)',
        success: true
      });

    });

    // Verifying that success message is present in the UI
    cy.contains(/Sending email to 1 recipient/i).should('be.visible').highlight();

  });

  // Scenario where user edits a link
  it('edit link', () => {

    // Monitoring the backend API request and response
    cy.intercept('PUT', '**api/v1/web/upload-links/**').as('editLink');

    // Going to more actions 
    cy.contains('td', 'Testing Link')
      .parent('tr')
      .find('button[aria-label="Options"]')
      .click();

    // Editing link by clicking "Edit"
    cy.contains('button', /Edit/i).click();

    // Verifying edit link form is present
    cy.contains(/Edit Upload Link/i).should('be.visible').highlight();

    // Filling out link name field
    cy.get('input[placeholder="Enter link name"]').clear().type('Test Edit');

    // Submitting edit link form by clicking "Update Link"
    cy.contains('button', /Update Link/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@editLink').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/upload-links/');
      expect(request.method).to.eq('PUT');
      expect(request.body).to.include({
        link_name: 'Test Edit'
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("success", "upload_link");
      expect(response.body.upload_link.link_name).to.eq('Test Edit');
      expect(response.body).to.include({
        success: true
      });


    });

    // Verifying that success message is present in the UI
    cy.contains(/Upload link updated successfully/i).should('be.visible').highlight();

    // Verifying that the link name is updated in the UI
    cy.contains(/Test Edit/i).should('be.visible').highlight();

  });

  // Scenario where user disables a link
  it('disable link', () => {

    // Monitoring the backend API request and response
    cy.intercept('PUT', '**api/v1/web/upload-links/**').as('disableLink');

    // Going to more actions 
    cy.contains('td', 'Test Edit')
      .parent('tr')
      .find('button[aria-label="Options"]')
      .click();

    // Disabling link by clicking "Disable"
    cy.contains('button', /Disable/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@disableLink').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/upload-links/');
      expect(request.method).to.eq('PUT');
      expect(request.body).to.include({
        is_active: false
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("success", "upload_link");
      expect(response.body.upload_link.is_active).to.eq(false);
      expect(response.body).to.include({
        success: true
      });


    });

    // Verifying that success message is present in the UI
    cy.contains(/Link disabled successfully/i).should('be.visible').highlight();

    // Verifying that the status for "Test Edit" is updated in the UI
    cy.contains('td', 'Test Edit')
      .parents('tr')
      .within(() => {
        cy.contains('Inactive').should('be.visible')
      .highlight()
    });

  });

});