// COMPANY MEMBERS E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login('user_1');
    cy.contains('button', /Members/i).click();

  });

  // Verifying that all page elements are rendered into the page
  it('displays members information', () => {

    // Verifying header is present
    cy.contains(/Company Members/i).should('be.visible').highlight();

    // Verifying each input fields and buttons are present for company section
    cy.contains('button', /Invite Member/i).should('be.visible').highlight();
    cy.get('input[type="email"]').should('be.visible').highlight();
    cy.get('select').contains('option', 'Member').highlight();
    cy.contains('button', /^Invite$/i).should('be.visible').highlight();

    // Verifying that admin is present in the member list
    cy.getUser('user_1').then((user) => {
      cy.contains(user.initials).should('be.visible').highlight();
      cy.contains(user.firstName).should('be.visible').highlight();
      cy.contains(user.lastName).should('be.visible').highlight();
      cy.contains(user.email).should('be.visible').highlight();
    });


  });

});



// -------------------------------------------------------------------------------------------------------------------- 
// SUCCESS SCENARIOS 
// Verifying that members can invite other members and are listed

describe('Success Scenarios', () => {

  // Scenario where new members are being invited
  it('invite new members', () => {

    // Logging in user
    cy.login('user_1');
    cy.contains('button', /Members/i).click();

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

      // Verifying the correct API endpoint, HTTP method, email, and role was used for the request
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
    cy.contains(`Invitation sent to ${email}`).should('be.visible').highlight();

  });

  // Scenario where members who have accepted are listed in the member list
  it('list members', () => {

    // Visiting signup page from the invite
    cy.visit("/signup?invitation_token=CK6efXdGEu6FXNmK-7nX6JqvuHid5qZdf9acCge2cxU&company_id=3");

    // Loogging in invited user
    cy.contains(/Already have an account\? Log in/i).click();
    cy.login('user_2');

    // ERROR
    // Users receive the email of the invite but after logging in they do not see any notification to accep the invite
    // No user that is invited is listed
    cy.get('button[title="Notifications"]').click();
    cy.contains(/Company Invitation Received/i).should('be.visible').highlight();
    cy.contains('button[title="Accept company invitation"]').click();

    // Signing out invited user
    cy.getUser('user_1').then((user) => {
      cy.get('button', user.initials).click();
    });

    cy.contains('button', /Sign out/i).click();

    // Logging in admin
    cy.login('user_1');
    cy.get('button', /Members/i).click();

    // Verifying that invited member is present in the member list
    cy.getUser('user_2').then((user) => {
      cy.contains(user.initials).should('be.visible').highlight();
      cy.contains(user.firstName).should('be.visible').highlight();
      cy.contains(user.lastName).should('be.visible').highlight();
      cy.contains(user.email).should('be.visible').highlight();
    });

  });

});



// -------------------------------------------------------------------------------------------------------------------- 
// ERROR VALIDATION 
// Checking if the system responds to an already invited member

describe('Error Validation', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login('user_1');
    cy.contains('button', /Members/i).click();

  });

  // Scenario where an existing member is invited again
  it('invite existing member', () => {

    // Filling out email field
    cy.getUser('user_1').then((user) => {
      cy.get('input[type="email"]').type(user.email);
    });

    // Trigger error by selecting "Invite" button
    cy.contains('button', /^Invite$/i).click();

    // Verifying each error message are present
    cy.contains(/User is already in this company/i).should('be.visible').highlight();

  });

  // Scenario where a user that has been invited is invited again
  it('invite pending user', () => {

    // Filling out email field
    cy.getUser('user_2').then((user) => {
      cy.get('input[type="email"]').type(user.email);
    });

    // Trigger error by selecting "Invite" button
    cy.contains('button', /^Invite$/i).click();

    // Verifying each error message are present
    cy.contains(/An invitation is already pending for this email/i).should('be.visible').highlight();

  });

});