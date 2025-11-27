// Custom Cypress Commands for CargoRapido

// Login command for users
Cypress.Commands.add('loginUser', (email, password) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Login command for drivers
Cypress.Commands.add('loginDriver', (email, password) => {
  cy.visit('/driver/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/driver');
});

// Login via API (faster for test setup)
Cypress.Commands.add('loginViaAPI', (email, password, userType = 'user') => {
  const endpoint = userType === 'driver' ? '/auth/driver/login' : '/auth/login';

  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    body: { email, password }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('success', true);
    expect(response.body.data).to.have.property('token');

    // Store token and user data in localStorage
    window.localStorage.setItem('token', response.body.data.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.data));
  });
});

// Create booking command
Cypress.Commands.add('createBooking', (bookingData) => {
  const token = window.localStorage.getItem('token');

  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/bookings`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: bookingData
  }).then((response) => {
    expect(response.status).to.eq(201);
    return response.body.data;
  });
});

// Wait for element and click
Cypress.Commands.add('clickElement', (selector, options = {}) => {
  cy.get(selector, options).should('be.visible').click();
});

// Type with delay (more realistic user behavior)
Cypress.Commands.add('typeRealistic', { prevSubject: 'element' }, (subject, text, options = {}) => {
  cy.wrap(subject).type(text, { delay: 50, ...options });
});

// Check toast notification
Cypress.Commands.add('checkToast', (message, type = 'success') => {
  cy.get('.Toaster').should('contain', message);
});

// Clear local storage and cookies
Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Seed test data
Cypress.Commands.add('seedTestUser', () => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/register`,
    body: {
      name: 'Test User',
      email: `test.user.${Date.now()}@test.com`,
      phone: `9${Math.floor(Math.random() * 1000000000)}`,
      password: 'Test@1234'
    },
    failOnStatusCode: false
  });
});

Cypress.Commands.add('seedTestDriver', () => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/driver/register`,
    body: {
      name: 'Test Driver',
      email: `test.driver.${Date.now()}@test.com`,
      phone: `8${Math.floor(Math.random() * 1000000000)}`,
      password: 'Test@1234',
      licenseNumber: `DL${Math.floor(Math.random() * 1000000000)}`,
      licenseExpiry: '2025-12-31',
      aadharNumber: `${Math.floor(Math.random() * 1000000000000)}`,
      panNumber: `PAN${Math.floor(Math.random() * 1000000)}`
    },
    failOnStatusCode: false
  });
});
