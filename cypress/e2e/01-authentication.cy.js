describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearAuth();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', () => {
      const testEmail = `user.${Date.now()}@test.com`;
      const testPhone = `9${Math.floor(Math.random() * 1000000000)}`;

      cy.visit('/register');
      cy.get('input[name="name"]').typeRealistic('Test User');
      cy.get('input[name="email"]').typeRealistic(testEmail);
      cy.get('input[name="phone"]').typeRealistic(testPhone);
      cy.get('input[name="password"]').typeRealistic('Test@1234');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/dashboard');
      cy.contains('Test User').should('be.visible');
    });

    it('should show validation errors for invalid data', () => {
      cy.visit('/register');
      cy.get('button[type="submit"]').click();

      // Check for validation messages
      cy.contains('required').should('be.visible');
    });

    it('should not allow registration with existing email', () => {
      cy.visit('/register');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('existing@test.com');
      cy.get('input[name="phone"]').type('9876543210');
      cy.get('input[name="password"]').type('Test@1234');
      cy.get('button[type="submit"]').click();

      cy.contains('already exists').should('be.visible');
    });
  });

  describe('User Login', () => {
    it('should login existing user successfully', () => {
      cy.visit('/login');
      cy.get('input[type="email"]').typeRealistic('test@test.com');
      cy.get('input[type="password"]').typeRealistic('Test@1234');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/dashboard');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      cy.get('input[type="email"]').type('wrong@test.com');
      cy.get('input[type="password"]').type('WrongPass');
      cy.get('button[type="submit"]').click();

      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should redirect to login when accessing protected routes', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });

  describe('Driver Registration', () => {
    it('should register a new driver successfully', () => {
      const testEmail = `driver.${Date.now()}@test.com`;
      const testPhone = `8${Math.floor(Math.random() * 1000000000)}`;

      cy.visit('/driver/register');
      cy.get('input[name="name"]').typeRealistic('Test Driver');
      cy.get('input[name="email"]').typeRealistic(testEmail);
      cy.get('input[name="phone"]').typeRealistic(testPhone);
      cy.get('input[name="licenseNumber"]').typeRealistic('DL1234567890');
      cy.get('input[name="password"]').typeRealistic('Test@1234');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/driver');
    });
  });

  describe('Driver Login', () => {
    it('should login existing driver successfully', () => {
      cy.visit('/driver/login');
      cy.get('input[type="email"]').typeRealistic('driver@test.com');
      cy.get('input[type="password"]').typeRealistic('Test@1234');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/driver');
    });
  });

  describe('Logout', () => {
    it('should logout user and redirect to login', () => {
      cy.loginUser('test@test.com', 'Test@1234');
      cy.get('button').contains('Logout').click();

      cy.url().should('include', '/login');
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });
});
