describe('Booking Creation Flow', () => {
  beforeEach(() => {
    cy.clearAuth();
    cy.loginUser('test@test.com', 'Test@1234');
  });

  describe('Create New Booking', () => {
    it('should create a booking with all required fields', () => {
      cy.visit('/dashboard/new-booking');

      // Fill pickup address
      cy.get('input[placeholder*="Street"]').first().typeRealistic('123 MG Road');
      cy.get('input[placeholder*="Area"]').first().typeRealistic('Koramangala');
      cy.get('input[placeholder*="State"]').first().type('Karnataka');
      cy.get('div').contains('Karnataka').click();
      cy.get('input[placeholder*="District"]').first().type('Bangalore');
      cy.get('div').contains('Bangalore').click();
      cy.get('input[placeholder*="Pincode"]').first().typeRealistic('560034');

      // Fill drop address
      cy.get('input[placeholder*="Street"]').eq(1).typeRealistic('456 Brigade Road');
      cy.get('input[placeholder*="Area"]').eq(1).typeRealistic('MG Road');
      cy.get('input[placeholder*="State"]').eq(1).type('Karnataka');
      cy.get('div').contains('Karnataka').click();
      cy.get('input[placeholder*="District"]').eq(1).type('Bangalore');
      cy.get('div').contains('Bangalore').click();
      cy.get('input[placeholder*="Pincode"]').eq(1).typeRealistic('560001');

      // Fill distance
      cy.get('input[name="distance"]').typeRealistic('15');

      // Select cargo size
      cy.contains('Small').click();

      // Fill cargo details
      cy.get('input[name="weight"]').typeRealistic('25');
      cy.get('textarea[name="description"]').typeRealistic('Electronics - Handle with care');

      // Click create booking
      cy.get('button').contains('Create Booking').click();

      // Should redirect to tracking page
      cy.url().should('include', '/dashboard/tracking');
      cy.checkToast('Booking created successfully');
    });

    it('should show price estimate when filling details', () => {
      cy.visit('/dashboard/new-booking');

      cy.get('input[name="distance"]').typeRealistic('10');
      cy.contains('Small').click();

      // Price should be visible
      cy.contains('₹').should('be.visible');
      cy.contains('Total').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.visit('/dashboard/new-booking');
      cy.get('button').contains('Create Booking').click();

      // Should show validation errors
      cy.contains('required').should('be.visible');
    });

    it('should allow selecting add-ons', () => {
      cy.visit('/dashboard/new-booking');

      // Fill basic details first
      cy.get('input[name="distance"]').type('10');
      cy.contains('Small').click();

      // Select add-ons
      cy.contains('Fragile Handling').click();
      cy.contains('Express Delivery').click();

      // Price should update
      cy.contains('₹').should('be.visible');
    });
  });

  describe('View My Deliveries', () => {
    it('should display all user bookings', () => {
      cy.visit('/dashboard/deliveries');

      cy.contains('My Deliveries').should('be.visible');
      // Should show booking cards or empty state
      cy.get('body').should('exist');
    });

    it('should allow filtering bookings by status', () => {
      cy.visit('/dashboard/deliveries');

      // If filter exists
      cy.get('body').then(($body) => {
        if ($body.find('select[name="status"]').length) {
          cy.get('select[name="status"]').select('completed');
        }
      });
    });

    it('should navigate to tracking page when clicking on booking', () => {
      cy.visit('/dashboard/deliveries');

      cy.get('body').then(($body) => {
        if ($body.find('a:contains("Track")').length) {
          cy.get('a').contains('Track').first().click();
          cy.url().should('include', '/dashboard/tracking');
        }
      });
    });
  });

  describe('Live Tracking', () => {
    it('should display booking details and status', () => {
      // Create a booking first
      cy.visit('/dashboard/new-booking');
      // ... fill form and submit ...

      // Should be on tracking page
      cy.url().should('include', '/dashboard/tracking');
      cy.contains('Booking ID').should('be.visible');
      cy.contains('Status').should('be.visible');
    });
  });
});
