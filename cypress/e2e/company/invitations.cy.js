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



// -------------------------------------------------------------------------------------------------------------------- 
// SUCCESS SCENARIOS 
// Verifying that invited users are listed

describe('Success Scenarios', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login('user_1');
    cy.contains('button', /Members/i).click();

  });

  // Scenario where users are being invited
  it('list invites', () => {

    // Monitoring the backend API request and response
    cy.intercept('GET', '**api/v1/company/3/invitations').as('invitations');

    // Generating a unique email to invite
    const unique = Date.now().toString();
    const email = unique + '@example.com';

    // Filling out email information
    cy.get('input[type="email"]').type(email);

    // Submiting the member invite by selecting "Invite"
    cy.contains('button', /^Invite$/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@invitations').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/company/3/invitations');
      expect(request.method).to.eq('GET');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("invitations", "success");
      expect(response.body).to.include({
        success: true
      });

      // Verifying that the invitation is listed properly in the backend
      const invitation = response.body.invitations;
      expect(invitation[0].email).to.eq(email);

    });

    // Verifying that the invited is listed in the UI
    cy.contains('button', /Invitations/i).click();
    cy.contains(email).should('be.visible').highlight();

  });

});