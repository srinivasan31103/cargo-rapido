// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Import cypress-axe for accessibility testing
import 'cypress-axe';

// Import testing library commands
import '@testing-library/cypress/add-commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions. Adjust based on your needs.
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  return true;
});

// Set viewport size for consistent testing
beforeEach(() => {
  cy.viewport(1280, 720);
});

// Clear local storage and cookies before each test
beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Add custom matchers
chai.use((chai, utils) => {
  chai.Assertion.addMethod('beVisible', function () {
    const obj = this._obj;
    new chai.Assertion(obj).to.be.visible;
  });
});

// Global test configuration
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 10000);
Cypress.config('responseTimeout', 10000);
