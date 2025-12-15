// COMPANY OVERVIEW E2E TEST

// -------------------------------------------------------------------------------------------------------------------- 
// UI VERIFICATION 
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user before each test
  beforeEach(() => {

    cy.login('user_1');

  });

  // Verifying that all page elements are rendered into the page
  it('displays overview information', () => {

    // Verifying header is present
    cy.contains(/Company Overview/i).should('be.visible').highlight();

    // Verifying key company account information are present
    cy.contains(/Total Members/i).should('be.visible').highlight();
    cy.contains(/Workspaces/i).should('be.visible').highlight();
    cy.contains(/Subscription Tier/i).should('be.visible').highlight();

    // Verifying main company credentials are present
    cy.getCompany().then((company) => {
      cy.contains(company.name).should('be.visible').highlight();
      cy.contains(company.email).should('be.visible').highlight();
      cy.contains(company.website).should('be.visible').highlight();
    });

  });

});



// -------------------------------------------------------------------------------------------------------------------- 
// SUCCESS SCENARIOS 
// Verifying that the dashbaord stats are updated 

describe('Success Scenarios', () => {

  // Logging in user before each test and getting the current member count
  beforeEach(() => {

    cy.login('user_1');

    cy.intercept('GET', '**/api/v1/company/my-company').as('getCompany');

    let initialUserCount;
    cy.wait('@getCompany').then(({ response }) => {
      initialUserCount = response.body.company.user_count;
    });

  });

  // Scenario where members who have accepted and the stats are updated
  it('update stats', () => {

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

    // Monitoring the backend API request and response
    cy.intercept('GET', '**api/v1/company/my-company').as('updateStats');

    // Logging in admin
    cy.login('user_1');

    // Verifying that the backend receives and responds correctly
    cy.wait('@updateStats').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/company/my-company');
      expect(request.method).to.eq('GET');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include.keys("company", "is_individual", "success");
      expect(response.body).to.include({
        success: true
      });

      // Verifying that the member stats is updated correctly in the backend 
      const updatedUserCount = response.body.company.user_count;
      expect(updatedUserCount).to.eq(initialUserCount + 1);

    });

    // Verifying that the member stats is updated in the UI
    cy.contains('Total Members')
      .parent()
      .find('div.text-2xl')
      .invoke('text')
      .then((text) => {
        const updatedUICount = Number(text.trim());
        expect(updatedUICount).to.eq(initialUserCount + 1);
      })
      .highlight();

  });

});