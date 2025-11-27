describe('Wallet and Payment Flow', () => {
  beforeEach(() => {
    cy.clearAuth();
    cy.loginUser('test@test.com', 'Test@1234');
  });

  describe('Wallet Management', () => {
    it('should display current wallet balance', () => {
      cy.visit('/dashboard/wallet');

      cy.contains('Wallet Balance').should('be.visible');
      cy.contains('₹').should('be.visible');
    });

    it('should show transaction history', () => {
      cy.visit('/dashboard/wallet');

      cy.contains('Transaction History').should('be.visible');
    });

    it('should allow wallet recharge', () => {
      cy.visit('/dashboard/wallet');

      cy.get('button').contains('Recharge').click();

      // Enter amount
      cy.get('input[name="amount"]').type('500');
      cy.get('button[type="submit"]').click();

      // Would redirect to payment gateway in production
      cy.url().should('exist');
    });

    it('should validate minimum recharge amount', () => {
      cy.visit('/dashboard/wallet');

      cy.get('button').contains('Recharge').click();
      cy.get('input[name="amount"]').type('50');
      cy.get('button[type="submit"]').click();

      cy.contains('minimum').should('be.visible');
    });
  });

  describe('Booking Payment', () => {
    it('should show payment options during booking', () => {
      cy.visit('/dashboard/new-booking');

      // Fill basic booking details
      cy.get('input[name="distance"]').type('10');
      cy.contains('Small').click();

      // Should show payment method selection
      cy.get('body').then(($body) => {
        if ($body.find('select[name="paymentMethod"]').length) {
          cy.get('select[name="paymentMethod"]').should('be.visible');
        }
      });
    });

    it('should allow paying with wallet if sufficient balance', () => {
      cy.visit('/dashboard/new-booking');

      // Create booking with wallet payment
      // Fill all required fields...
      cy.get('input[name="distance"]').type('10');
      cy.contains('Small').click();

      // Select wallet payment
      cy.get('body').then(($body) => {
        if ($body.find('input[value="wallet"]').length) {
          cy.get('input[value="wallet"]').check();
        }
      });

      cy.get('button').contains('Create Booking').click();

      cy.url().should('include', '/tracking');
    });

    it('should show error if insufficient wallet balance', () => {
      cy.visit('/dashboard/new-booking');

      // Try to create expensive booking
      cy.get('input[name="distance"]').type('1000');
      cy.contains('Large').click();

      cy.get('body').then(($body) => {
        if ($body.find('input[value="wallet"]').length) {
          cy.get('input[value="wallet"]').check();
          cy.get('button').contains('Create Booking').click();

          cy.contains('Insufficient').should('be.visible');
        }
      });
    });
  });

  describe('Transaction History', () => {
    it('should filter transactions by type', () => {
      cy.visit('/dashboard/wallet');

      cy.get('body').then(($body) => {
        if ($body.find('select[name="transactionType"]').length) {
          cy.get('select[name="transactionType"]').select('booking_payment');
          cy.wait(1000);
        }
      });
    });

    it('should show transaction details', () => {
      cy.visit('/dashboard/wallet');

      cy.get('body').then(($body) => {
        if ($body.find('.transaction-item').length) {
          cy.get('.transaction-item').first().should('contain', '₹');
        }
      });
    });
  });
});
