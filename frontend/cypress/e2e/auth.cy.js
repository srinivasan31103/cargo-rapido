/// <reference types="cypress" />

describe('Authentication Flow', () => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    phone: '+919876543210',
    password: 'Test@1234',
    role: 'user'
  };

  const testDriver = {
    name: 'Test Driver',
    email: 'testdriver@example.com',
    phone: '+919876543211',
    password: 'Driver@1234',
    role: 'driver'
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', () => {
      cy.visit('/register');

      // Check page title
      cy.contains('Create Account').should('be.visible');

      // Fill registration form
      cy.get('input[name="name"]').type(testUser.name);
      cy.get('input[name="email"]').type(`cypress_${Date.now()}@example.com`);
      cy.get('input[name="phone"]').type(testUser.phone);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="confirmPassword"]').type(testUser.password);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome').should('be.visible');

      // Token should be stored
      cy.window().its('localStorage.token').should('exist');
    });

    it('should show validation errors for invalid inputs', () => {
      cy.visit('/register');

      // Submit empty form
      cy.get('button[type="submit"]').click();

      // Check validation messages
      cy.contains('Name is required').should('be.visible');
      cy.contains('Email is required').should('be.visible');
      cy.contains('Phone is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should validate email format', () => {
      cy.visit('/register');

      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="email"]').blur();

      cy.contains('Invalid email format').should('be.visible');
    });

    it('should validate password strength', () => {
      cy.visit('/register');

      // Weak password
      cy.get('input[name="password"]').type('weak');
      cy.get('input[name="password"]').blur();

      cy.contains('Password must be at least 8 characters').should('be.visible');

      // Clear and enter strong password
      cy.get('input[name="password"]').clear().type(testUser.password);

      // Password strength indicator should show
      cy.get('[data-testid="password-strength"]').should('be.visible');
    });

    it('should validate password confirmation', () => {
      cy.visit('/register');

      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="confirmPassword"]').type('DifferentPassword123');
      cy.get('input[name="confirmPassword"]').blur();

      cy.contains('Passwords do not match').should('be.visible');
    });

    it('should show error for duplicate email', () => {
      cy.visit('/register');

      cy.get('input[name="name"]').type(testUser.name);
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="phone"]').type(testUser.phone);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="confirmPassword"]').type(testUser.password);

      cy.intercept('POST', '**/api/auth/register', {
        statusCode: 400,
        body: {
          success: false,
          message: 'User already exists'
        }
      }).as('registerRequest');

      cy.get('button[type="submit"]').click();

      cy.wait('@registerRequest');
      cy.contains('User already exists').should('be.visible');
    });

    it('should toggle password visibility', () => {
      cy.visit('/register');

      // Password should be hidden by default
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');

      // Click toggle button
      cy.get('[data-testid="toggle-password-visibility"]').first().click();

      // Password should be visible
      cy.get('input[name="password"]').should('have.attr', 'type', 'text');

      // Click again to hide
      cy.get('[data-testid="toggle-password-visibility"]').first().click();
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', () => {
      cy.visit('/login');

      cy.contains('Sign In').should('be.visible');

      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);

      cy.intercept('POST', '**/api/auth/login').as('loginRequest');

      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');
      cy.url().should('not.include', '/login');
      cy.window().its('localStorage.token').should('exist');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('WrongPassword123');

      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid credentials'
        }
      }).as('loginRequest');

      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');
      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should show validation for empty fields', () => {
      cy.visit('/login');

      cy.get('button[type="submit"]').click();

      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should remember me functionality', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('input[name="rememberMe"]').check();

      cy.get('button[type="submit"]').click();

      // Check if remember me cookie is set
      cy.getCookie('rememberMe').should('exist');
    });

    it('should redirect to intended page after login', () => {
      // Try to access protected route
      cy.visit('/bookings/new');

      // Should redirect to login
      cy.url().should('include', '/login');

      // Login
      cy.login(testUser.email, testUser.password);

      // Should redirect back to bookings page
      cy.url().should('include', '/bookings/new');
    });
  });

  describe('Driver Login', () => {
    it('should login as driver and redirect to driver dashboard', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type(testDriver.email);
      cy.get('input[name="password"]').type(testDriver.password);

      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          token: 'mock_driver_token',
          user: {
            id: 'driver123',
            email: testDriver.email,
            name: testDriver.name,
            role: 'driver'
          }
        }
      }).as('driverLogin');

      cy.get('button[type="submit"]').click();

      cy.wait('@driverLogin');
      cy.url().should('include', '/driver/dashboard');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Login before each logout test
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/dashboard');
    });

    it('should logout successfully', () => {
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();

      // Should redirect to login
      cy.url().should('include', '/login');

      // Token should be cleared
      cy.window().its('localStorage.token').should('not.exist');

      // User data should be cleared
      cy.window().its('localStorage.user').should('not.exist');
    });

    it('should clear all user data on logout', () => {
      // Set some user data
      cy.window().then((win) => {
        win.localStorage.setItem('bookings', JSON.stringify([{ id: 1 }]));
        win.localStorage.setItem('preferences', JSON.stringify({ theme: 'dark' }));
      });

      cy.logout();

      // All data should be cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
        expect(win.localStorage.getItem('user')).to.be.null;
        expect(win.localStorage.getItem('bookings')).to.be.null;
        expect(win.localStorage.getItem('preferences')).to.be.null;
      });
    });
  });

  describe('Password Reset', () => {
    it('should request password reset', () => {
      cy.visit('/login');

      cy.contains('Forgot Password?').click();
      cy.url().should('include', '/forgot-password');

      cy.get('input[name="email"]').type(testUser.email);

      cy.intercept('POST', '**/api/auth/forgot-password', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Password reset link sent to email'
        }
      }).as('forgotPassword');

      cy.get('button[type="submit"]').click();

      cy.wait('@forgotPassword');
      cy.contains('Password reset link sent').should('be.visible');
    });

    it('should reset password with valid token', () => {
      const resetToken = 'valid_reset_token';

      cy.visit(`/reset-password?token=${resetToken}`);

      cy.get('input[name="password"]').type('NewPassword@123');
      cy.get('input[name="confirmPassword"]').type('NewPassword@123');

      cy.intercept('POST', '**/api/auth/reset-password', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Password reset successful'
        }
      }).as('resetPassword');

      cy.get('button[type="submit"]').click();

      cy.wait('@resetPassword');
      cy.contains('Password reset successful').should('be.visible');
      cy.url().should('include', '/login');
    });

    it('should show error for expired token', () => {
      const expiredToken = 'expired_token';

      cy.visit(`/reset-password?token=${expiredToken}`);

      cy.get('input[name="password"]').type('NewPassword@123');
      cy.get('input[name="confirmPassword"]').type('NewPassword@123');

      cy.intercept('POST', '**/api/auth/reset-password', {
        statusCode: 400,
        body: {
          success: false,
          message: 'Invalid or expired token'
        }
      }).as('resetPassword');

      cy.get('button[type="submit"]').click();

      cy.wait('@resetPassword');
      cy.contains('Invalid or expired token').should('be.visible');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without auth', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/login');

      cy.visit('/bookings');
      cy.url().should('include', '/login');

      cy.visit('/profile');
      cy.url().should('include', '/login');
    });

    it('should allow access to protected routes when authenticated', () => {
      cy.loginViaAPI(testUser.email, testUser.password);

      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');

      cy.visit('/bookings');
      cy.url().should('include', '/bookings');

      cy.visit('/profile');
      cy.url().should('include', '/profile');
    });

    it('should redirect driver to driver routes only', () => {
      cy.loginViaAPI(testDriver.email, testDriver.password);

      cy.visit('/admin/dashboard');
      cy.url().should('not.include', '/admin');
      cy.contains('Unauthorized').should('be.visible');
    });
  });

  describe('Session Management', () => {
    it('should maintain session across page reloads', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/dashboard');

      // Reload page
      cy.reload();

      // Should still be logged in
      cy.url().should('include', '/dashboard');
      cy.window().its('localStorage.token').should('exist');
    });

    it('should expire session after token expiration', () => {
      cy.loginViaAPI(testUser.email, testUser.password);
      cy.visit('/dashboard');

      // Mock expired token
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'expired_token');
      });

      // Make an API call
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

  describe('Social Login', () => {
    it('should login with Google (mock)', () => {
      cy.visit('/login');

      cy.intercept('GET', '**/api/auth/google', {
        statusCode: 200,
        body: {
          success: true,
          redirectUrl: 'https://accounts.google.com/...'
        }
      }).as('googleAuth');

      cy.get('[data-testid="google-login"]').click();

      cy.wait('@googleAuth');

      // In real scenario, this would open Google OAuth
      // For testing, we mock the callback
      cy.visit('/auth/google/callback?code=mock_code');

      cy.url().should('include', '/dashboard');
    });
  });

  describe('Accessibility', () => {
    it('login page should be accessible', () => {
      cy.visit('/login');
      cy.checkA11y();
    });

    it('register page should be accessible', () => {
      cy.visit('/register');
      cy.checkA11y();
    });

    it('should support keyboard navigation', () => {
      cy.visit('/login');

      // Tab through form fields
      cy.get('body').tab();
      cy.focused().should('have.attr', 'name', 'email');

      cy.focused().tab();
      cy.focused().should('have.attr', 'name', 'password');

      cy.focused().tab();
      cy.focused().should('have.attr', 'type', 'submit');
    });
  });
});
