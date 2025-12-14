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
    cy.contains('button', /^Invite$/i).should('be.visible');

    // Verifying that admin is present in the member list
    cy.fixture('user').then((user) => {
      cy.contains(user.initials).should('be.visible');
      cy.contains(user.firstName).should('be.visible');
      cy.contains(user.lastName).should('be.visible');
      cy.contains(user.email).should('be.visible');
    });

  });

});



// -------------------------------------------------------------------------------------------------------------------- 
// SUCCESS SCENARIOS 
// Verifying that members can invite other members and are listed

describe('Success Scenarios', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login();
    cy.contains('button', /Members/i).click();

  });

  it('invite new members', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/company/3/invite').as('inviteMembers');

    // Generating a unique email to invite
    const unique = Date.now().toString();
    const email = unique + '@example.com';

    // Filling out email information
    cy.get('input[type="email"]').type(email);

    // Submiting the member invite by selecting "Invite"
    cy.contains('button', /^Invite$/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@inviteMembers').then(({request, response}) => {

      // Verifying the correct API endpoint, HTTP method, email, and username was used for the request
      expect(request.url).to.include('/api/v1/company/3/invite');
      expect(request.method).to.eq('POST');
      expect(request.body).to.include({
        email: email,
        role: 'member'
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("invitation", "message", "success");
      expect(response.body).to.include({
        message: 'Invitation created and sent successfully',
        success: true
      });

    });

    // Verifying that success message is present in the UI
    cy.contains(`Invitation sent to ${email}`).should('be.visible');

  });

});