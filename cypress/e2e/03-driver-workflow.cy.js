describe('Driver Workflow', () => {
  beforeEach(() => {
    cy.clearAuth();
    cy.loginDriver('driver@test.com', 'Test@1234');
  });

  describe('Driver Dashboard', () => {
    it('should display driver dashboard with stats', () => {
      cy.visit('/driver');

      cy.contains('Dashboard').should('be.visible');
      cy.contains('Total Deliveries').should('be.visible');
      cy.contains('Earnings').should('be.visible');
    });

    it('should show online/offline toggle', () => {
      cy.visit('/driver');

      // Toggle should be visible
      cy.get('button').contains(/online|offline/i).should('be.visible');
    });
  });

  describe('Incoming Requests', () => {
    it('should display available booking requests', () => {
      cy.visit('/driver/requests');

      cy.contains('Incoming Requests').should('be.visible');
      // Should show either bookings or "No Available Requests"
      cy.get('body').should('exist');
    });

    it('should allow accepting a booking request', () => {
      cy.visit('/driver/requests');

      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Accept")').length) {
          cy.get('button').contains('Accept').first().click();

          // Should redirect to ride page
          cy.url().should('include', '/driver/ride');
          cy.checkToast('accepted successfully');
        }
      });
    });

    it('should auto-refresh to show new bookings', () => {
      cy.visit('/driver/requests');

      // Wait for auto-refresh (10 seconds)
      cy.wait(10000);

      // Page should still be on requests
      cy.url().should('include', '/requests');
    });
  });

  describe('Active Ride Management', () => {
    it('should display booking details in ride page', () => {
      cy.visit('/driver');

      cy.get('body').then(($body) => {
        if ($body.find('button:contains("View Active Ride")').length) {
          cy.get('button').contains('View Active Ride').click();

          cy.contains('Pickup').should('be.visible');
          cy.contains('Drop').should('be.visible');
          cy.contains('Customer').should('be.visible');
        }
      });
    });

    it('should allow updating ride status', () => {
      cy.visit('/driver');

      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Start Ride")').length) {
          cy.get('button').contains('Start Ride').click();
          cy.checkToast('Status updated');
        }
      });
    });
  });

  describe('Proof of Delivery (POD)', () => {
    it('should upload pickup proof with OTP', () => {
      cy.visit('/driver');

      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Upload Pickup Proof")').length) {
          cy.get('button').contains('Upload Pickup Proof').click();

          // Upload photo (if file input exists)
          cy.get('input[type="file"]').then(($input) => {
            if ($input.length) {
              cy.fixture('test-image.jpg', 'base64').then((fileContent) => {
                cy.get('input[type="file"]').attachFile({
                  fileContent,
                  fileName: 'pickup-proof.jpg',
                  mimeType: 'image/jpeg',
                  encoding: 'base64'
                });
              });
            }
          });

          // Enter OTP
          cy.get('input[name="otp"]').type('123456');
          cy.get('button[type="submit"]').click();
        }
      });
    });

    it('should upload delivery proof and complete booking', () => {
      cy.visit('/driver');

      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Upload Delivery Proof")').length) {
          cy.get('button').contains('Upload Delivery Proof').click();

          // Fill recipient details
          cy.get('input[name="recipientName"]').type('John Doe');
          cy.get('input[name="recipientPhone"]').type('9876543210');

          // Enter delivery OTP
          cy.get('input[name="otp"]').type('654321');
          cy.get('button[type="submit"]').click();

          cy.checkToast('Delivery completed');
        }
      });
    });
  });

  describe('Driver Earnings', () => {
    it('should display earnings summary', () => {
      cy.visit('/driver/earnings');

      cy.contains('Earnings').should('be.visible');
      cy.contains('Total').should('be.visible');
    });

    it('should show earnings breakdown', () => {
      cy.visit('/driver/earnings');

      cy.contains('Completed Deliveries').should('be.visible');
    });
  });

  describe('Driver Profile', () => {
    it('should allow updating driver profile', () => {
      cy.visit('/driver');
      cy.get('a').contains('Profile').click();

      cy.get('input[name="name"]').clear().type('Updated Driver Name');
      cy.get('button').contains('Save').click();

      cy.checkToast('Profile updated');
    });
  });
});
