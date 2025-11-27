/// <reference types="cypress" />

describe('Booking Flow', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'Test@1234'
  };

  const testDriver = {
    email: 'testdriver@example.com',
    password: 'Driver@1234'
  };

  const sampleBooking = {
    pickupAddress: 'Mumbai Central, Mumbai',
    deliveryAddress: 'Andheri West, Mumbai',
    cargoType: 'electronics',
    weight: '15',
    dimensions: {
      length: '30',
      width: '20',
      height: '15'
    },
    description: 'Laptop and accessories',
    deliveryType: 'express'
  };

  beforeEach(() => {
    cy.loginViaAPI(testUser.email, testUser.password);
  });

  describe('Create Booking', () => {
    it('should create a booking successfully', () => {
      cy.visit('/bookings/new');

      cy.contains('Create New Booking').should('be.visible');

      // Step 1: Pickup and Delivery Locations
      cy.get('input[name="pickupAddress"]').type(sampleBooking.pickupAddress);
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.get('input[name="deliveryAddress"]').type(sampleBooking.deliveryAddress);
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      // Check if map is displayed
      cy.get('.mapboxgl-canvas').should('be.visible');

      cy.get('[data-testid="next-step"]').click();

      // Step 2: Cargo Details
      cy.get('select[name="cargoType"]').select(sampleBooking.cargoType);
      cy.get('input[name="weight"]').type(sampleBooking.weight);
      cy.get('input[name="dimensions.length"]').type(sampleBooking.dimensions.length);
      cy.get('input[name="dimensions.width"]').type(sampleBooking.dimensions.width);
      cy.get('input[name="dimensions.height"]').type(sampleBooking.dimensions.height);
      cy.get('textarea[name="description"]').type(sampleBooking.description);

      cy.get('[data-testid="next-step"]').click();

      // Step 3: Delivery Type and Schedule
      cy.get(`input[name="deliveryType"][value="${sampleBooking.deliveryType}"]`).check();

      // Price estimate should be displayed
      cy.get('[data-testid="price-estimate"]').should('be.visible');
      cy.get('[data-testid="price-amount"]').should('not.be.empty');

      cy.get('[data-testid="next-step"]').click();

      // Step 4: Review and Confirm
      cy.contains('Review Your Booking').should('be.visible');

      // Verify booking details
      cy.contains(sampleBooking.pickupAddress).should('be.visible');
      cy.contains(sampleBooking.deliveryAddress).should('be.visible');
      cy.contains(sampleBooking.cargoType).should('be.visible');
      cy.contains(sampleBooking.weight).should('be.visible');

      // Intercept booking creation
      cy.intercept('POST', '**/api/bookings').as('createBooking');

      cy.get('button[type="submit"]').contains('Confirm Booking').click();

      cy.wait('@createBooking');

      // Should show success message
      cy.waitForNotification('Booking created successfully');

      // Should redirect to booking details
      cy.url().should('include', '/bookings/');
    });

    it('should show validation errors for incomplete booking', () => {
      cy.visit('/bookings/new');

      // Try to proceed without filling pickup address
      cy.get('[data-testid="next-step"]').click();

      cy.contains('Pickup address is required').should('be.visible');
      cy.contains('Delivery address is required').should('be.visible');
    });

    it('should calculate distance and show on map', () => {
      cy.visit('/bookings/new');

      cy.mockGeolocation(19.0760, 72.8777); // Mumbai coordinates

      cy.get('input[name="pickupAddress"]').type(sampleBooking.pickupAddress);
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.get('input[name="deliveryAddress"]').type(sampleBooking.deliveryAddress);
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      // Distance should be calculated
      cy.get('[data-testid="distance"]').should('be.visible');
      cy.get('[data-testid="distance"]').should('contain', 'km');

      // Route should be displayed on map
      cy.get('.mapbox-gl-draw_line').should('exist');
    });

    it('should update price when delivery type changes', () => {
      cy.visit('/bookings/new');

      // Fill basic details
      cy.createBooking(sampleBooking);

      // Get initial price
      cy.get('[data-testid="price-amount"]').then(($price) => {
        const initialPrice = $price.text();

        // Change delivery type
        cy.get('input[name="deliveryType"][value="standard"]').check();

        // Price should update
        cy.get('[data-testid="price-amount"]').should('not.have.text', initialPrice);
      });
    });

    it('should show surge pricing during peak hours', () => {
      cy.visit('/bookings/new');

      // Mock current time as peak hour (9 AM)
      cy.clock(new Date(2025, 0, 15, 9, 0, 0));

      cy.createBooking(sampleBooking);

      // Surge pricing indicator should be visible
      cy.get('[data-testid="surge-pricing"]').should('be.visible');
      cy.contains('Peak hours').should('be.visible');
    });

    it('should save booking as draft', () => {
      cy.visit('/bookings/new');

      // Fill partial details
      cy.get('input[name="pickupAddress"]').type(sampleBooking.pickupAddress);
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      // Save as draft
      cy.get('[data-testid="save-draft"]').click();

      cy.contains('Draft saved').should('be.visible');

      // Navigate away and come back
      cy.visit('/dashboard');
      cy.visit('/bookings/new');

      // Draft should be restored
      cy.get('input[name="pickupAddress"]').should('have.value', sampleBooking.pickupAddress);
    });
  });

  describe('View Bookings', () => {
    beforeEach(() => {
      // Create a test booking via API
      cy.createBookingViaAPI({
        pickupLocation: {
          address: sampleBooking.pickupAddress,
          coordinates: [72.8777, 19.0760]
        },
        deliveryLocation: {
          address: sampleBooking.deliveryAddress,
          coordinates: [72.8348, 19.1176]
        },
        cargo: {
          type: sampleBooking.cargoType,
          weight: parseFloat(sampleBooking.weight),
          dimensions: sampleBooking.dimensions,
          description: sampleBooking.description
        },
        deliveryType: sampleBooking.deliveryType
      });
    });

    it('should display list of bookings', () => {
      cy.visit('/bookings');

      cy.contains('My Bookings').should('be.visible');

      // Booking list should be visible
      cy.get('[data-testid^="booking-"]').should('have.length.greaterThan', 0);

      // Each booking should show key information
      cy.get('[data-testid^="booking-"]').first().within(() => {
        cy.get('[data-testid="booking-id"]').should('be.visible');
        cy.get('[data-testid="pickup-address"]').should('be.visible');
        cy.get('[data-testid="delivery-address"]').should('be.visible');
        cy.get('[data-testid="status-badge"]').should('be.visible');
      });
    });

    it('should filter bookings by status', () => {
      cy.visit('/bookings');

      // Filter by pending
      cy.get('[data-testid="filter-status"]').select('pending');
      cy.get('[data-testid^="booking-"]').each(($booking) => {
        cy.wrap($booking).find('[data-testid="status-badge"]').should('contain', 'Pending');
      });

      // Filter by in-progress
      cy.get('[data-testid="filter-status"]').select('in-progress');

      // Filter by completed
      cy.get('[data-testid="filter-status"]').select('completed');
    });

    it('should search bookings', () => {
      cy.visit('/bookings');

      cy.get('[data-testid="search-bookings"]').type('Mumbai');

      cy.get('[data-testid^="booking-"]').each(($booking) => {
        cy.wrap($booking).should('contain', 'Mumbai');
      });
    });

    it('should sort bookings', () => {
      cy.visit('/bookings');

      // Sort by date (newest first)
      cy.get('[data-testid="sort-by"]').select('date-desc');

      // Sort by price (highest first)
      cy.get('[data-testid="sort-by"]').select('price-desc');

      // Sort by status
      cy.get('[data-testid="sort-by"]').select('status');
    });
  });

  describe('Booking Details', () => {
    let bookingId;

    beforeEach(() => {
      cy.createBookingViaAPI({
        pickupLocation: {
          address: sampleBooking.pickupAddress,
          coordinates: [72.8777, 19.0760]
        },
        deliveryLocation: {
          address: sampleBooking.deliveryAddress,
          coordinates: [72.8348, 19.1176]
        },
        cargo: {
          type: sampleBooking.cargoType,
          weight: parseFloat(sampleBooking.weight),
          dimensions: sampleBooking.dimensions,
          description: sampleBooking.description
        },
        deliveryType: sampleBooking.deliveryType
      }).then((booking) => {
        bookingId = booking._id;
      });
    });

    it('should view booking details', () => {
      cy.visit(`/bookings/${bookingId}`);

      cy.contains('Booking Details').should('be.visible');

      // All booking information should be displayed
      cy.get('[data-testid="booking-id"]').should('contain', bookingId.slice(-6));
      cy.get('[data-testid="status"]').should('be.visible');
      cy.get('[data-testid="pickup-location"]').should('contain', sampleBooking.pickupAddress);
      cy.get('[data-testid="delivery-location"]').should('contain', sampleBooking.deliveryAddress);
      cy.get('[data-testid="cargo-details"]').should('be.visible');
      cy.get('[data-testid="price"]').should('be.visible');
    });

    it('should show timeline of booking status', () => {
      cy.visit(`/bookings/${bookingId}`);

      cy.get('[data-testid="booking-timeline"]').should('be.visible');

      // Timeline should show status updates
      cy.get('[data-testid="timeline-item"]').should('have.length.greaterThan', 0);
    });

    it('should display driver information when assigned', () => {
      // Mock booking with driver assigned
      cy.intercept('GET', `**/api/bookings/${bookingId}`, {
        statusCode: 200,
        body: {
          success: true,
          booking: {
            _id: bookingId,
            status: 'in-progress',
            driver: {
              name: 'Test Driver',
              phone: '+919876543210',
              vehicle: {
                type: 'mini-truck',
                number: 'MH12AB1234'
              },
              rating: 4.5
            }
          }
        }
      }).as('getBooking');

      cy.visit(`/bookings/${bookingId}`);
      cy.wait('@getBooking');

      // Driver information should be visible
      cy.get('[data-testid="driver-info"]').should('be.visible');
      cy.contains('Test Driver').should('be.visible');
      cy.contains('+919876543210').should('be.visible');
      cy.contains('MH12AB1234').should('be.visible');

      // Call driver button should be visible
      cy.get('[data-testid="call-driver"]').should('be.visible');
    });

    it('should show live tracking when in progress', () => {
      cy.intercept('GET', `**/api/bookings/${bookingId}`, {
        statusCode: 200,
        body: {
          success: true,
          booking: {
            _id: bookingId,
            status: 'in-progress',
            driver: {
              location: {
                coordinates: [72.8500, 19.1000]
              }
            }
          }
        }
      }).as('getBooking');

      cy.visit(`/bookings/${bookingId}`);
      cy.wait('@getBooking');

      // Live tracking map should be visible
      cy.get('[data-testid="live-tracking-map"]').should('be.visible');

      // Driver marker should be on map
      cy.get('.mapboxgl-marker').should('exist');

      // ETA should be displayed
      cy.get('[data-testid="eta"]').should('be.visible');
    });
  });

  describe('Cancel Booking', () => {
    let bookingId;

    beforeEach(() => {
      cy.createBookingViaAPI({
        pickupLocation: {
          address: sampleBooking.pickupAddress,
          coordinates: [72.8777, 19.0760]
        },
        deliveryLocation: {
          address: sampleBooking.deliveryAddress,
          coordinates: [72.8348, 19.1176]
        },
        cargo: {
          type: sampleBooking.cargoType,
          weight: parseFloat(sampleBooking.weight),
          dimensions: sampleBooking.dimensions,
          description: sampleBooking.description
        },
        deliveryType: sampleBooking.deliveryType
      }).then((booking) => {
        bookingId = booking._id;
      });
    });

    it('should cancel booking successfully', () => {
      cy.visit(`/bookings/${bookingId}`);

      cy.get('[data-testid="cancel-booking"]').click();

      // Confirmation modal should appear
      cy.get('[data-testid="cancel-modal"]').should('be.visible');
      cy.contains('Are you sure').should('be.visible');

      // Select cancellation reason
      cy.get('select[name="cancellationReason"]').select('Changed plans');
      cy.get('textarea[name="cancellationNote"]').type('Need to reschedule');

      cy.intercept('PUT', `**/api/bookings/${bookingId}/cancel`).as('cancelBooking');

      cy.get('[data-testid="confirm-cancel"]').click();

      cy.wait('@cancelBooking');

      cy.contains('Booking cancelled successfully').should('be.visible');

      // Status should be updated
      cy.get('[data-testid="status"]').should('contain', 'Cancelled');
    });

    it('should show cancellation fee if applicable', () => {
      cy.intercept('GET', `**/api/bookings/${bookingId}`, {
        statusCode: 200,
        body: {
          success: true,
          booking: {
            _id: bookingId,
            status: 'in-progress',
            cancellationFee: 50
          }
        }
      }).as('getBooking');

      cy.visit(`/bookings/${bookingId}`);
      cy.wait('@getBooking');

      cy.get('[data-testid="cancel-booking"]').click();

      // Cancellation fee should be displayed
      cy.contains('Cancellation fee').should('be.visible');
      cy.contains('₹50').should('be.visible');
    });

    it('should not allow cancellation if already in transit', () => {
      cy.intercept('GET', `**/api/bookings/${bookingId}`, {
        statusCode: 200,
        body: {
          success: true,
          booking: {
            _id: bookingId,
            status: 'picked-up',
            canCancel: false
          }
        }
      }).as('getBooking');

      cy.visit(`/bookings/${bookingId}`);
      cy.wait('@getBooking');

      // Cancel button should be disabled
      cy.get('[data-testid="cancel-booking"]').should('be.disabled');
      cy.contains('Cannot cancel after pickup').should('be.visible');
    });
  });

  describe('Driver Booking Flow', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.loginViaAPI(testDriver.email, testDriver.password);
    });

    it('should view available bookings', () => {
      cy.visit('/driver/available-bookings');

      cy.contains('Available Bookings').should('be.visible');

      // List of available bookings should be displayed
      cy.get('[data-testid^="booking-"]').should('have.length.greaterThan', 0);

      // Each booking should show relevant info
      cy.get('[data-testid^="booking-"]').first().within(() => {
        cy.get('[data-testid="distance"]').should('be.visible');
        cy.get('[data-testid="earning"]').should('be.visible');
        cy.get('[data-testid="accept-button"]').should('be.visible');
      });
    });

    it('should accept a booking', () => {
      cy.visit('/driver/available-bookings');

      cy.get('[data-testid^="booking-"]').first().within(() => {
        cy.get('[data-testid="booking-id"]').invoke('text').as('bookingId');
        cy.get('[data-testid="accept-button"]').click();
      });

      cy.get('@bookingId').then((bookingId) => {
        cy.intercept('POST', `**/api/bookings/${bookingId}/accept`).as('acceptBooking');
        cy.wait('@acceptBooking');
      });

      cy.contains('Booking accepted').should('be.visible');

      // Should redirect to active bookings
      cy.url().should('include', '/driver/active-bookings');
    });

    it('should start pickup', () => {
      const bookingId = 'test_booking_123';

      cy.visit(`/driver/bookings/${bookingId}`);

      cy.get('[data-testid="start-pickup"]').click();

      cy.intercept('PUT', `**/api/bookings/${bookingId}/status`).as('updateStatus');
      cy.wait('@updateStatus');

      cy.contains('On the way to pickup').should('be.visible');

      // Navigation button should be visible
      cy.get('[data-testid="navigate-to-pickup"]').should('be.visible');
    });

    it('should mark as picked up', () => {
      const bookingId = 'test_booking_123';

      cy.visit(`/driver/bookings/${bookingId}`);

      // Mock that driver has reached pickup location
      cy.mockGeolocation(19.0760, 72.8777);

      cy.get('[data-testid="mark-picked-up"]').click();

      // Upload pickup photo
      cy.get('input[type="file"]').attachFile('pickup-photo.jpg');

      // Add OTP verification
      cy.get('input[name="otp"]').type('1234');

      cy.get('[data-testid="confirm-pickup"]').click();

      cy.contains('Cargo picked up').should('be.visible');
    });

    it('should complete delivery with POD', () => {
      const bookingId = 'test_booking_123';

      cy.visit(`/driver/bookings/${bookingId}`);

      cy.get('[data-testid="complete-delivery"]').click();

      // POD modal should appear
      cy.get('[data-testid="pod-modal"]').should('be.visible');

      // Upload delivery photo
      cy.get('input[name="deliveryPhoto"]').attachFile('delivery-photo.jpg');

      // Recipient details
      cy.get('input[name="recipientName"]').type('John Doe');
      cy.get('input[name="recipientPhone"]').type('+919876543210');

      // Signature
      cy.get('[data-testid="signature-pad"]')
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: 100, clientY: 100 })
        .trigger('mousemove', { clientX: 200, clientY: 150 })
        .trigger('mouseup');

      cy.intercept('POST', `**/api/bookings/${bookingId}/complete`).as('completeDelivery');

      cy.get('button[type="submit"]').contains('Complete').click();

      cy.wait('@completeDelivery');

      cy.contains('Delivery completed').should('be.visible');

      // Confetti celebration should appear
      cy.get('[data-testid="confetti"]').should('exist');
    });
  });

  describe('Real-time Updates', () => {
    let bookingId;

    beforeEach(() => {
      cy.createBookingViaAPI({
        pickupLocation: {
          address: sampleBooking.pickupAddress,
          coordinates: [72.8777, 19.0760]
        },
        deliveryLocation: {
          address: sampleBooking.deliveryAddress,
          coordinates: [72.8348, 19.1176]
        },
        cargo: {
          type: sampleBooking.cargoType,
          weight: parseFloat(sampleBooking.weight),
          dimensions: sampleBooking.dimensions,
          description: sampleBooking.description
        },
        deliveryType: sampleBooking.deliveryType
      }).then((booking) => {
        bookingId = booking._id;
      });
    });

    it('should receive real-time status updates', () => {
      cy.visit(`/bookings/${bookingId}`);

      cy.waitForSocket();

      // Mock socket event
      cy.window().then((win) => {
        win.socket.emit('booking:statusUpdate', {
          bookingId,
          status: 'driver-assigned',
          driver: {
            name: 'Test Driver',
            phone: '+919876543210'
          }
        });
      });

      // Notification should appear
      cy.waitForNotification('Driver assigned');

      // Status should be updated
      cy.get('[data-testid="status"]').should('contain', 'Driver Assigned');
    });

    it('should update driver location in real-time', () => {
      cy.visit(`/bookings/${bookingId}`);

      cy.waitForSocket();

      // Mock driver location updates
      const locations = [
        [72.8500, 19.0800],
        [72.8600, 19.0900],
        [72.8700, 19.1000]
      ];

      locations.forEach((location, index) => {
        cy.window().then((win) => {
          win.socket.emit('driver:locationUpdate', {
            bookingId,
            location: {
              coordinates: location
            }
          });
        });

        cy.wait(1000);

        // Driver marker should move
        cy.get('.mapboxgl-marker').should('exist');

        // ETA should update
        cy.get('[data-testid="eta"]').should('be.visible');
      });
    });
  });

  describe('Accessibility', () => {
    it('booking creation page should be accessible', () => {
      cy.visit('/bookings/new');
      cy.checkA11y();
    });

    it('booking list page should be accessible', () => {
      cy.visit('/bookings');
      cy.checkA11y();
    });

    it('booking details page should be accessible', () => {
      cy.createBookingViaAPI({
        pickupLocation: {
          address: sampleBooking.pickupAddress,
          coordinates: [72.8777, 19.0760]
        },
        deliveryLocation: {
          address: sampleBooking.deliveryAddress,
          coordinates: [72.8348, 19.1176]
        },
        cargo: {
          type: sampleBooking.cargoType,
          weight: parseFloat(sampleBooking.weight),
          dimensions: sampleBooking.dimensions,
          description: sampleBooking.description
        },
        deliveryType: sampleBooking.deliveryType
      }).then((booking) => {
        cy.visit(`/bookings/${booking._id}`);
        cy.checkA11y();
      });
    });
  });
});
