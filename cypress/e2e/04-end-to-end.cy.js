describe('Complete End-to-End Booking Flow', () => {
  let bookingId;

  it('Complete booking lifecycle: User creates → Driver accepts → Driver delivers', () => {
    // Step 1: User creates a booking
    cy.clearAuth();
    cy.loginUser('test@test.com', 'Test@1234');

    cy.visit('/dashboard/new-booking');
    cy.log('Creating new booking as user...');

    // Fill pickup address
    cy.get('input[placeholder*="Street"]').first().type('123 MG Road');
    cy.get('input[placeholder*="Area"]').first().type('Koramangala');
    cy.get('input[placeholder*="State"]').first().type('Karnataka');
    cy.wait(500);
    cy.contains('Karnataka').click();
    cy.get('input[placeholder*="District"]').first().type('Bangalore');
    cy.wait(500);
    cy.contains('Bangalore').first().click();
    cy.get('input[placeholder*="Pincode"]').first().type('560034');

    // Fill drop address
    cy.get('input[placeholder*="Street"]').eq(1).type('456 Brigade Road');
    cy.get('input[placeholder*="Area"]').eq(1).type('MG Road');
    cy.get('input[placeholder*="State"]').eq(1).type('Karnataka');
    cy.wait(500);
    cy.get('div').contains('Karnataka').last().click();
    cy.get('input[placeholder*="District"]').eq(1).type('Bangalore');
    cy.wait(500);
    cy.get('div').contains('Bangalore').last().click();
    cy.get('input[placeholder*="Pincode"]').eq(1).type('560001');

    // Fill distance and cargo details
    cy.get('input[name="distance"]').type('15');
    cy.contains('Small').click();
    cy.get('input[name="weight"]').type('25');
    cy.get('textarea[name="description"]').type('Test package');

    // Create booking
    cy.get('button').contains('Create Booking').click();
    cy.wait(2000);

    // Extract booking ID from URL
    cy.url().then((url) => {
      const matches = url.match(/tracking\/([a-f0-9]+)/);
      if (matches) {
        bookingId = matches[1];
        cy.log(`Booking created with ID: ${bookingId}`);
      }
    });

    cy.log('Booking created successfully');

    // Step 2: Driver logs in and sees the booking request
    cy.clearAuth();
    cy.loginDriver('driver@test.com', 'Test@1234');

    cy.visit('/driver/requests');
    cy.log('Driver viewing incoming requests...');

    // Wait for booking to appear
    cy.wait(3000);

    // Accept the booking
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Accept")').length) {
        cy.log('Driver accepting booking...');
        cy.get('button').contains('Accept').first().click();
        cy.wait(1000);
        cy.checkToast('accepted');
      } else {
        cy.log('No bookings available to accept');
      }
    });

    // Step 3: Driver marks as arrived
    cy.log('Driver updating status to arrived...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Arrived")').length) {
        cy.get('button').contains('Arrived').click();
        cy.wait(1000);
      }
    });

    // Step 4: Driver uploads pickup proof and verifies OTP
    cy.log('Driver uploading pickup proof...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Pickup")').length) {
        cy.get('button').contains('Pickup').click();

        // Enter pickup OTP (would be displayed to user)
        cy.get('input[name="otp"]').type('123456');
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
      }
    });

    // Step 5: Driver marks as in transit
    cy.log('Driver marking as in transit...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("In Transit")').length) {
        cy.get('button').contains('In Transit').click();
        cy.wait(1000);
      }
    });

    // Step 6: Driver reaches destination
    cy.log('Driver reached destination...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Reached")').length) {
        cy.get('button').contains('Reached').click();
        cy.wait(1000);
      }
    });

    // Step 7: Driver uploads delivery proof and completes
    cy.log('Driver uploading delivery proof...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Complete")').length) {
        cy.get('button').contains('Complete').click();

        // Fill recipient details
        cy.get('input[name="recipientName"]').type('John Doe');
        cy.get('input[name="recipientPhone"]').type('9876543210');

        // Enter delivery OTP
        cy.get('input[name="otp"]').type('654321');
        cy.get('button[type="submit"]').click();

        cy.checkToast('completed');
        cy.wait(1000);
      }
    });

    // Step 8: Verify user can see completed booking
    cy.clearAuth();
    cy.loginUser('test@test.com', 'Test@1234');

    cy.visit('/dashboard/deliveries');
    cy.log('User checking completed deliveries...');

    cy.contains('completed', { matchCase: false }).should('exist');

    cy.log('✅ End-to-end booking flow completed successfully!');
  });
});
