// ***********************************************
// Custom commands for CargoRapido testing
// ***********************************************

import 'cypress-real-events';

// --- Authentication Commands ---

/**
 * Login command - authenticates a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (user/driver/admin)
 */
Cypress.Commands.add('login', (email, password, role = 'user') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();

  // Wait for successful login and redirect
  cy.url().should('not.include', '/login');
  cy.window().its('localStorage.token').should('exist');
});

/**
 * Login via API - faster for setup
 */
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password }
  }).then((response) => {
    expect(response.status).to.eq(200);
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.user));
  });
});

/**
 * Register a new user
 */
Cypress.Commands.add('register', (userData) => {
  cy.visit('/register');
  cy.get('input[name="name"]').type(userData.name);
  cy.get('input[name="email"]').type(userData.email);
  cy.get('input[name="phone"]').type(userData.phone);
  cy.get('input[name="password"]').type(userData.password);
  cy.get('input[name="confirmPassword"]').type(userData.password);
  cy.get('button[type="submit"]').click();
});

/**
 * Logout command
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});

// --- Booking Commands ---

/**
 * Create a booking through UI
 */
Cypress.Commands.add('createBooking', (bookingData) => {
  cy.visit('/bookings/new');

  // Fill pickup location
  cy.get('input[name="pickupAddress"]').type(bookingData.pickupAddress);
  cy.wait(500);
  cy.get('.autocomplete-results').first().click();

  // Fill delivery location
  cy.get('input[name="deliveryAddress"]').type(bookingData.deliveryAddress);
  cy.wait(500);
  cy.get('.autocomplete-results').first().click();

  // Select cargo type
  cy.get('select[name="cargoType"]').select(bookingData.cargoType);

  // Enter cargo details
  cy.get('input[name="weight"]').type(bookingData.weight);
  cy.get('input[name="dimensions.length"]').type(bookingData.dimensions.length);
  cy.get('input[name="dimensions.width"]').type(bookingData.dimensions.width);
  cy.get('input[name="dimensions.height"]').type(bookingData.dimensions.height);

  // Add description
  cy.get('textarea[name="description"]').type(bookingData.description);

  // Select delivery type
  cy.get(`input[name="deliveryType"][value="${bookingData.deliveryType}"]`).check();

  // Submit booking
  cy.get('button[type="submit"]').contains('Create Booking').click();
});

/**
 * Create booking via API
 */
Cypress.Commands.add('createBookingViaAPI', (bookingData) => {
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
    return response.body.booking;
  });
});

/**
 * Cancel a booking
 */
Cypress.Commands.add('cancelBooking', (bookingId) => {
  cy.get(`[data-testid="booking-${bookingId}"]`).within(() => {
    cy.get('[data-testid="cancel-booking"]').click();
  });
  cy.get('[data-testid="confirm-cancel"]').click();
  cy.contains('Booking cancelled successfully').should('be.visible');
});

// --- Driver Commands ---

/**
 * Accept a booking as driver
 */
Cypress.Commands.add('acceptBooking', (bookingId) => {
  cy.visit('/driver/available-bookings');
  cy.get(`[data-testid="booking-${bookingId}"]`).within(() => {
    cy.get('[data-testid="accept-booking"]').click();
  });
  cy.contains('Booking accepted').should('be.visible');
});

/**
 * Update driver location
 */
Cypress.Commands.add('updateDriverLocation', (latitude, longitude) => {
  const token = window.localStorage.getItem('token');

  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/drivers/location`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: {
      coordinates: [longitude, latitude]
    }
  });
});

/**
 * Complete delivery with POD
 */
Cypress.Commands.add('completeDelivery', (bookingId, podData) => {
  cy.visit(`/driver/bookings/${bookingId}`);
  cy.get('[data-testid="complete-delivery"]').click();

  // Upload POD image
  cy.get('input[type="file"]').attachFile(podData.image);

  // Enter recipient details
  cy.get('input[name="recipientName"]').type(podData.recipientName);
  cy.get('input[name="recipientPhone"]').type(podData.recipientPhone);

  // Add signature
  cy.get('[data-testid="signature-pad"]').trigger('mousedown', { which: 1 })
    .trigger('mousemove', { clientX: 100, clientY: 100 })
    .trigger('mouseup');

  cy.get('button[type="submit"]').contains('Complete Delivery').click();
  cy.contains('Delivery completed successfully').should('be.visible');
});

// --- Payment Commands ---

/**
 * Mock payment success
 */
Cypress.Commands.add('mockPaymentSuccess', (bookingId) => {
  cy.intercept('POST', `${Cypress.env('apiUrl')}/payments/process`, {
    statusCode: 200,
    body: {
      success: true,
      transactionId: 'pay_mock_' + Date.now(),
      message: 'Payment successful'
    }
  }).as('paymentRequest');
});

/**
 * Process payment through UI
 */
Cypress.Commands.add('processPayment', (paymentData) => {
  cy.get('[data-testid="pay-now"]').click();

  // In real scenario, this would integrate with Razorpay
  // For testing, we'll mock the payment gateway
  cy.mockPaymentSuccess();

  cy.get('[data-testid="confirm-payment"]').click();
  cy.wait('@paymentRequest');
  cy.contains('Payment successful').should('be.visible');
});

// --- Notification Commands ---

/**
 * Wait for notification to appear
 */
Cypress.Commands.add('waitForNotification', (message) => {
  cy.get('.notification-toast', { timeout: 10000 })
    .should('be.visible')
    .and('contain', message);
});

/**
 * Dismiss notification
 */
Cypress.Commands.add('dismissNotification', () => {
  cy.get('.notification-toast .close-button').click();
  cy.get('.notification-toast').should('not.exist');
});

// --- UI Testing Commands ---

/**
 * Check if element is animated
 */
Cypress.Commands.add('shouldBeAnimated', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should('have.css', 'animation-name').and('not.equal', 'none');
});

/**
 * Check if element has smooth transition
 */
Cypress.Commands.add('shouldHaveTransition', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should('have.css', 'transition-duration').and('not.equal', '0s');
});

/**
 * Wait for loading to finish
 */
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 15000 }).should('not.exist');
});

/**
 * Check skeleton loading
 */
Cypress.Commands.add('shouldShowSkeleton', () => {
  cy.get('.skeleton').should('be.visible');
});

// --- Security Testing Commands ---

/**
 * Try SQL/NoSQL injection
 */
Cypress.Commands.add('testNoSQLInjection', (inputSelector) => {
  const maliciousInput = '{"$gt": ""}';
  cy.get(inputSelector).type(maliciousInput);
  cy.get('button[type="submit"]').click();

  // Should not bypass authentication or cause errors
  cy.contains('Invalid').should('be.visible');
});

/**
 * Test XSS protection
 */
Cypress.Commands.add('testXSSProtection', (inputSelector) => {
  const xssScript = '<script>alert("XSS")</script>';
  cy.get(inputSelector).type(xssScript);
  cy.get('button[type="submit"]').click();

  // Script should be sanitized
  cy.on('window:alert', () => {
    throw new Error('XSS vulnerability detected!');
  });
});

/**
 * Test rate limiting
 */
Cypress.Commands.add('testRateLimit', (endpoint, expectedLimit) => {
  // Make rapid requests
  for (let i = 0; i < expectedLimit + 2; i++) {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}${endpoint}`,
      failOnStatusCode: false,
      body: { email: 'test@test.com', password: 'test' }
    }).as(`request-${i}`);
  }

  // Last request should be rate limited
  cy.get(`@request-${expectedLimit + 1}`).then((response) => {
    expect(response.status).to.eq(429);
    expect(response.body.message).to.include('Too many requests');
  });
});

// --- API Testing Commands ---

/**
 * Make authenticated API request
 */
Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
  const token = window.localStorage.getItem('token');

  const options = {
    method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  if (body) {
    options.body = body;
  }

  return cy.request(options);
});

/**
 * Check API response structure
 */
Cypress.Commands.add('validateAPIResponse', { prevSubject: true }, (response, schema) => {
  expect(response.status).to.be.oneOf([200, 201]);
  expect(response.body).to.have.property('success', true);

  if (schema) {
    Object.keys(schema).forEach(key => {
      expect(response.body).to.have.property(key);
    });
  }
});

// --- Accessibility Commands ---

/**
 * Check page accessibility
 */
Cypress.Commands.add('checkA11y', (context = null, options = null) => {
  cy.injectAxe();
  cy.checkA11y(context, options, (violations) => {
    if (violations.length) {
      cy.task('log', 'Accessibility violations found:');
      violations.forEach(violation => {
        cy.task('log', `${violation.id}: ${violation.description}`);
      });
    }
  });
});

// --- Utility Commands ---

/**
 * Wait for socket connection
 */
Cypress.Commands.add('waitForSocket', () => {
  cy.window().its('socket.connected').should('be.true');
});

/**
 * Simulate geolocation
 */
Cypress.Commands.add('mockGeolocation', (latitude, longitude) => {
  cy.window().then((win) => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
      callback({
        coords: { latitude, longitude }
      });
    });
  });
});

/**
 * Take screenshot with timestamp
 */
Cypress.Commands.add('screenshotWithTimestamp', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  cy.screenshot(`${name}-${timestamp}`);
});

/**
 * Drag and drop command
 */
Cypress.Commands.add('dragAndDrop', (dragSelector, dropSelector) => {
  cy.get(dragSelector).realMouseDown();
  cy.get(dropSelector).realMouseMove();
  cy.get(dropSelector).realMouseUp();
});
