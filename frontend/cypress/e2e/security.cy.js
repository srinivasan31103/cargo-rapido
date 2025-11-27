/// <reference types="cypress" />

describe('Security Features', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'Test@1234'
  };

  describe('Rate Limiting', () => {
    it('should rate limit login attempts', () => {
      cy.visit('/login');

      // Make multiple failed login attempts
      for (let i = 0; i < 6; i++) {
        cy.get('input[name="email"]').clear().type('test@example.com');
        cy.get('input[name="password"]').clear().type('wrongpassword');

        cy.intercept('POST', '**/api/auth/login').as(`loginAttempt${i}`);
        cy.get('button[type="submit"]').click();
        cy.wait(`@loginAttempt${i}`);
      }

      // After 5 attempts, should show rate limit error
      cy.contains('Too many login attempts').should('be.visible');
      cy.get('button[type="submit"]').should('be.disabled');

      // Wait message should be displayed
      cy.contains('Please try again after').should('be.visible');
    });

    it('should rate limit API requests', () => {
      cy.loginViaAPI(testUser.email, testUser.password);

      const token = window.localStorage.getItem('token');

      // Make rapid API requests
      const requests = [];
      for (let i = 0; i < 105; i++) {
        requests.push(
          cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/bookings`,
            headers: { Authorization: `Bearer ${token}` },
            failOnStatusCode: false
          })
        );
      }

      // Last request should be rate limited
      cy.wrap(requests[104]).then((response) => {
        expect(response.status).to.eq(429);
        expect(response.body.message).to.include('Too many requests');
      });
    });

    it('should rate limit payment requests more strictly', () => {
      cy.loginViaAPI(testUser.email, testUser.password);

      const token = window.localStorage.getItem('token');

      // Make rapid payment requests
      for (let i = 0; i < 12; i++) {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/payments/process`,
          headers: { Authorization: `Bearer ${token}` },
          body: { bookingId: 'test123', amount: 100 },
          failOnStatusCode: false
        }).as(`paymentRequest${i}`);
      }

      // After 10 requests in an hour, should be rate limited
      cy.get('@paymentRequest11').then((response) => {
        expect(response.status).to.eq(429);
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should prevent NoSQL injection in login', () => {
      cy.visit('/login');

      // Try NoSQL injection payload
      const injectionPayload = '{"$gt":""}';

      cy.get('input[name="email"]').type(injectionPayload);
      cy.get('input[name="password"]').type(injectionPayload);

      cy.intercept('POST', '**/api/auth/login').as('loginAttempt');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAttempt').then((interception) => {
        // Should return invalid credentials, not bypass authentication
        expect(interception.response.statusCode).to.eq(401);
        expect(interception.response.body.message).to.include('Invalid credentials');
      });

      // Should not bypass login
      cy.url().should('include', '/login');
    });

    it('should sanitize special characters in search', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/bookings');

      // Try to inject MongoDB operators
      cy.get('[data-testid="search-bookings"]').type('{"$where":"1==1"}');

      cy.intercept('GET', '**/api/bookings*').as('searchRequest');
      cy.wait('@searchRequest').then((interception) => {
        // Query should be sanitized
        const url = interception.request.url;
        expect(url).not.to.include('$where');
        expect(url).not.to.include('$gt');
        expect(url).not.to.include('$lt');
      });
    });

    it('should prevent XSS in input fields', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/bookings/new');

      const xssPayload = '<script>alert("XSS")</script>';

      // Try to inject XSS in description field
      cy.get('textarea[name="description"]').type(xssPayload);

      // Submit booking
      cy.get('input[name="pickupAddress"]').type('Mumbai');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.get('input[name="deliveryAddress"]').type('Pune');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.get('[data-testid="next-step"]').click();

      cy.get('select[name="cargoType"]').select('general');
      cy.get('input[name="weight"]').type('10');
      cy.get('input[name="dimensions.length"]').type('20');
      cy.get('input[name="dimensions.width"]').type('20');
      cy.get('input[name="dimensions.height"]').type('20');

      cy.intercept('POST', '**/api/bookings').as('createBooking');
      cy.get('[data-testid="next-step"]').click();
      cy.get('[data-testid="next-step"]').click();
      cy.get('button[type="submit"]').click();

      // XSS should not execute
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected!');
      });

      // Content should be sanitized
      cy.wait('@createBooking').then((interception) => {
        const description = interception.request.body.cargo.description;
        expect(description).not.to.include('<script>');
        expect(description).not.to.include('alert');
      });
    });

    it('should prevent HTML injection in user profile', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/profile');

      const htmlPayload = '<img src=x onerror=alert("XSS")>';

      // Try to inject HTML in name field
      cy.get('input[name="name"]').clear().type(htmlPayload);

      cy.intercept('PUT', '**/api/user/profile').as('updateProfile');
      cy.get('button[type="submit"]').click();

      cy.wait('@updateProfile');

      // HTML should be escaped
      cy.reload();
      cy.get('[data-testid="user-name"]').should('not.contain', '<img');
      cy.get('[data-testid="user-name"]').should('not.contain', 'onerror');

      // No script execution
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected!');
      });
    });

    it('should prevent parameter pollution', () => {
      cy.loginViaAPI(testUser.email, testUser.password);

      const token = window.localStorage.getItem('token');

      // Try HPP attack with duplicate parameters
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/bookings?status=pending&status=completed`,
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
        // Should only use one parameter value
        expect(response.status).to.eq(200);

        // Results should be filtered by one status only
        const bookings = response.body.bookings;
        const statuses = [...new Set(bookings.map(b => b.status))];
        expect(statuses.length).to.be.lessThan(3);
      });
    });
  });

  describe('CSRF Protection', () => {
    it('should include CSRF token in state-changing requests', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/bookings/new');

      // CSRF token should be present
      cy.getCookie('csrf-token').should('exist');

      // Create booking
      cy.intercept('POST', '**/api/bookings').as('createBooking');

      cy.createBooking({
        pickupAddress: 'Mumbai',
        deliveryAddress: 'Pune',
        cargoType: 'general',
        weight: '10',
        dimensions: { length: '20', width: '20', height: '20' },
        description: 'Test cargo',
        deliveryType: 'standard'
      });

      // CSRF token should be sent in headers
      cy.wait('@createBooking').then((interception) => {
        expect(interception.request.headers).to.have.property('x-csrf-token');
      });
    });

    it('should reject requests without valid CSRF token', () => {
      cy.loginViaAPI(testUser.email, testUser.password);

      const token = window.localStorage.getItem('token');

      // Make request without CSRF token
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/bookings`,
        headers: {
          Authorization: `Bearer ${token}`
          // No CSRF token
        },
        body: { test: 'data' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body.message).to.include('CSRF');
      });
    });
  });

  describe('Authentication Security', () => {
    it('should not expose sensitive information in errors', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type('nonexistent@example.com');
      cy.get('input[name="password"]').type('wrongpassword');

      cy.intercept('POST', '**/api/auth/login').as('loginAttempt');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginAttempt').then((interception) => {
        // Should return generic error message
        expect(interception.response.body.message).to.eq('Invalid credentials');

        // Should not reveal if email exists
        expect(interception.response.body.message).not.to.include('user not found');
        expect(interception.response.body.message).not.to.include('incorrect password');
      });
    });

    it('should enforce password complexity', () => {
      cy.visit('/register');

      // Try weak password
      cy.get('input[name="password"]').type('weak');
      cy.get('input[name="password"]').blur();

      cy.contains('at least 8 characters').should('be.visible');

      // Try password without uppercase
      cy.get('input[name="password"]').clear().type('password123');
      cy.contains('uppercase letter').should('be.visible');

      // Try password without number
      cy.get('input[name="password"]').clear().type('Password');
      cy.contains('number').should('be.visible');

      // Strong password should pass
      cy.get('input[name="password"]').clear().type('Password123');
      cy.get('[data-testid="password-strength"]').should('contain', 'Strong');
    });

    it('should secure JWT token storage', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/dashboard');

      // Token should be in localStorage
      cy.window().then((win) => {
        const token = win.localStorage.getItem('token');
        expect(token).to.exist;

        // Token should be a valid JWT format
        expect(token).to.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);

        // Token should not be accessible via document.cookie (httpOnly)
        expect(document.cookie).not.to.include('token');
      });
    });

    it('should handle token expiration', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/dashboard');

      // Set expired token
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired.token.here');
      });

      // Make authenticated request
      cy.intercept('GET', '**/api/user/profile', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Token expired'
        }
      }).as('profileRequest');

      cy.reload();
      cy.wait('@profileRequest');

      // Should redirect to login
      cy.url().should('include', '/login');
      cy.contains('Session expired').should('be.visible');
    });
  });

  describe('File Upload Security', () => {
    it('should validate file types for POD upload', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/driver/bookings/test123');

      cy.get('[data-testid="complete-delivery"]').click();

      // Try to upload invalid file type
      cy.get('input[name="deliveryPhoto"]').attachFile('malicious.exe', {
        allowEmpty: true
      });

      cy.contains('Invalid file type').should('be.visible');
      cy.contains('Only images are allowed').should('be.visible');
    });

    it('should validate file size', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/profile');

      // Mock large file
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg'
      });

      cy.get('input[type="file"]').then((input) => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(largeFile);
        input[0].files = dataTransfer.files;
        input[0].dispatchEvent(new Event('change', { bubbles: true }));
      });

      cy.contains('File size exceeds 5MB').should('be.visible');
    });

    it('should sanitize file names', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/profile');

      // File with malicious name
      cy.get('input[type="file"]').attachFile({
        fileContent: 'image data',
        fileName: '../../../etc/passwd.jpg',
        mimeType: 'image/jpeg'
      });

      cy.intercept('POST', '**/api/upload').as('uploadFile');
      cy.get('button[type="submit"]').click();

      cy.wait('@uploadFile').then((interception) => {
        // File name should be sanitized
        const fileName = interception.response.body.fileName;
        expect(fileName).not.to.include('../');
        expect(fileName).not.to.include('/');
        expect(fileName).not.to.include('\\');
      });
    });
  });

  describe('SQL/NoSQL Injection Prevention', () => {
    it('should prevent injection in booking search', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/bookings');

      const injectionPayloads = [
        '{"$gt":""}',
        '{"$ne":null}',
        '{"$where":"1==1"}',
        '\'; DROP TABLE bookings; --',
        '1\' OR \'1\'=\'1'
      ];

      injectionPayloads.forEach((payload) => {
        cy.get('[data-testid="search-bookings"]').clear().type(payload);

        cy.intercept('GET', '**/api/bookings*').as('searchRequest');
        cy.wait('@searchRequest').then((interception) => {
          // Should return normal results or error, not cause injection
          expect(interception.response.statusCode).to.be.oneOf([200, 400]);

          // Should not execute malicious query
          if (interception.response.statusCode === 200) {
            expect(interception.response.body).to.have.property('success', true);
          }
        });
      });
    });

    it('should sanitize MongoDB operators in filters', () => {
      cy.loginViaAPI(testUser.email, testUser.password);

      const token = window.localStorage.getItem('token');

      // Try to use MongoDB operators in query
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/bookings`,
        headers: { Authorization: `Bearer ${token}` },
        qs: {
          status: { $ne: 'pending' },
          price: { $gt: 0 }
        }
      }).then((response) => {
        // Should sanitize operators or return error
        expect(response.status).to.be.oneOf([200, 400]);

        // Query should be safe
        if (response.status === 200) {
          expect(response.body.success).to.be.true;
        }
      });
    });
  });

  describe('Security Headers', () => {
    it('should set security headers', () => {
      cy.request({
        method: 'GET',
        url: Cypress.env('apiUrl')
      }).then((response) => {
        // Check for security headers
        expect(response.headers).to.have.property('x-content-type-options', 'nosniff');
        expect(response.headers).to.have.property('x-frame-options', 'DENY');
        expect(response.headers).to.have.property('x-xss-protection');
        expect(response.headers).to.have.property('strict-transport-security');
      });
    });

    it('should set Content Security Policy', () => {
      cy.visit('/');

      cy.document().then((doc) => {
        const cspMeta = doc.querySelector('meta[http-equiv="Content-Security-Policy"]');
        expect(cspMeta).to.exist;

        const csp = cspMeta.getAttribute('content');
        expect(csp).to.include("default-src 'self'");
      });
    });
  });

  describe('Session Security', () => {
    it('should clear sensitive data on logout', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/dashboard');

      // Set some sensitive data
      cy.window().then((win) => {
        win.sessionStorage.setItem('sensitive', 'data');
        win.localStorage.setItem('bookingDraft', JSON.stringify({ id: 1 }));
      });

      // Logout
      cy.logout();

      // All sensitive data should be cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
        expect(win.localStorage.getItem('user')).to.be.null;
        expect(win.sessionStorage.getItem('sensitive')).to.be.null;
        expect(win.localStorage.getItem('bookingDraft')).to.be.null;
      });
    });

    it('should prevent session fixation', () => {
      // Set a session ID before login
      cy.setCookie('sessionId', 'attacker_session');

      cy.login(testUser.email, testUser.password);

      // Session ID should be regenerated after login
      cy.getCookie('sessionId').then((cookie) => {
        expect(cookie.value).not.to.eq('attacker_session');
      });
    });

    it('should implement session timeout', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/dashboard');

      // Mock time passing (30 minutes)
      cy.clock();
      cy.tick(30 * 60 * 1000);

      // Make an API request
      cy.intercept('GET', '**/api/bookings').as('bookingsRequest');
      cy.reload();

      // Should show session timeout warning
      cy.contains('Session timeout warning').should('be.visible');
      cy.contains('extend session').should('be.visible');
    });
  });

  describe('IP and Device Security', () => {
    it('should detect suspicious login locations', () => {
      // Login from one location
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        headers: {
          'X-Forwarded-For': '103.21.127.10' // Mumbai IP
        },
        body: {
          email: testUser.email,
          password: testUser.password
        }
      }).then((response) => {
        const token = response.body.token;

        // Immediately try to login from different location
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/auth/login`,
          headers: {
            'X-Forwarded-For': '185.220.101.1', // Different country IP
            Authorization: `Bearer ${token}`
          },
          body: {
            email: testUser.email,
            password: testUser.password
          },
          failOnStatusCode: false
        }).then((response2) => {
          // Should flag suspicious activity
          if (response2.status === 200) {
            expect(response2.body).to.have.property('requiresVerification', true);
          }
        });
      });
    });

    it('should block known malicious IPs', () => {
      // Try to access from blacklisted IP
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/bookings`,
        headers: {
          'X-Forwarded-For': '0.0.0.0' // Commonly blacklisted
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body.message).to.include('blocked');
      });
    });
  });

  describe('Data Encryption', () => {
    it('should encrypt sensitive data in storage', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/profile');

      // Add payment information
      cy.get('[data-testid="add-payment-method"]').click();
      cy.get('input[name="cardNumber"]').type('4111111111111111');
      cy.get('input[name="cvv"]').type('123');

      cy.intercept('POST', '**/api/user/payment-methods').as('addPayment');
      cy.get('button[type="submit"]').click();

      cy.wait('@addPayment').then((interception) => {
        // Card details should not be sent in plain text
        expect(interception.request.body.cardNumber).not.to.eq('4111111111111111');

        // Should be encrypted or tokenized
        expect(interception.request.body).to.have.property('paymentToken');
      });
    });
  });

  describe('Accessibility Security', () => {
    it('should not expose sensitive information to screen readers', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/profile');

      // Payment information should be masked
      cy.get('[data-testid="saved-card"]').within(() => {
        cy.contains('****').should('be.visible');
        cy.should('not.contain', '4111111111111111');
      });

      // aria-labels should not contain sensitive data
      cy.get('[aria-label]').each(($el) => {
        const ariaLabel = $el.attr('aria-label');
        expect(ariaLabel).not.to.match(/\d{16}/); // No full card numbers
        expect(ariaLabel).not.to.match(/\d{3,4}/); // No CVV
      });
    });
  });
});
