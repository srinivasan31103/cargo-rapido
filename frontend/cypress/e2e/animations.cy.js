/// <reference types="cypress" />

describe('Animations and UI Effects', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'Test@1234'
  };

  beforeEach(() => {
    cy.loginViaAPI(testUser.email, testUser.password);
  });

  describe('Page Transition Animations', () => {
    it('should animate page transitions', () => {
      cy.visit('/dashboard');

      // Click navigation link
      cy.get('[data-testid="bookings-link"]').click();

      // Check for fade-in animation
      cy.get('main').should('have.css', 'animation-name').and('not.equal', 'none');

      // Page should animate in
      cy.get('main').should('be.visible');
    });

    it('should have smooth route transitions', () => {
      cy.visit('/dashboard');

      cy.get('[data-testid="profile-link"]').click();

      // Check transition duration
      cy.get('main')
        .should('have.css', 'transition-duration')
        .and('not.equal', '0s');
    });
  });

  describe('Component Animations', () => {
    it('should animate card components', () => {
      cy.visit('/dashboard');

      // Wait for cards to load
      cy.get('.card').should('be.visible');

      // Cards should have hover animation
      cy.get('.card').first().realHover();

      // Should have transform on hover
      cy.get('.card')
        .first()
        .should('have.css', 'transform')
        .and('not.equal', 'none');
    });

    it('should animate button interactions', () => {
      cy.visit('/bookings/new');

      // Button should have ripple effect
      cy.get('button[type="submit"]').click();

      // Check for ripple animation
      cy.get('button[type="submit"]')
        .should('have.class', 'ripple')
        .or('have.css', 'animation-name');
    });

    it('should animate modal open/close', () => {
      cy.visit('/bookings');

      // Open modal
      cy.get('[data-testid="create-booking"]').click();

      // Modal should fade in
      cy.get('[data-testid="booking-modal"]')
        .should('be.visible')
        .and('have.css', 'animation-name')
        .and('not.equal', 'none');

      // Close modal
      cy.get('[data-testid="close-modal"]').click();

      // Modal should fade out
      cy.get('[data-testid="booking-modal"]').should('not.be.visible');
    });

    it('should animate dropdown menus', () => {
      cy.visit('/dashboard');

      // Open user menu
      cy.get('[data-testid="user-menu"]').click();

      // Dropdown should slide in
      cy.get('[data-testid="user-dropdown"]')
        .should('be.visible')
        .and('have.css', 'animation-name');

      // Close dropdown
      cy.get('body').click(0, 0);
      cy.get('[data-testid="user-dropdown"]').should('not.be.visible');
    });
  });

  describe('Scroll Animations', () => {
    it('should animate elements on scroll', () => {
      cy.visit('/');

      // Scroll down to features section
      cy.get('[data-testid="features-section"]').scrollIntoView();

      // Elements should fade in when in viewport
      cy.get('[data-testid="feature-card"]')
        .should('be.visible')
        .and('have.css', 'opacity', '1');
    });

    it('should use intersection observer for scroll reveals', () => {
      cy.visit('/');

      // Check elements that should be revealed on scroll
      cy.get('[data-testid="scroll-reveal"]').each(($el) => {
        // Scroll element into view
        cy.wrap($el).scrollIntoView();

        // Should become visible with animation
        cy.wrap($el)
          .should('be.visible')
          .and('have.css', 'opacity')
          .and('not.equal', '0');
      });
    });

    it('should have parallax effect on scroll', () => {
      cy.visit('/');

      // Get initial position
      cy.get('[data-testid="parallax-bg"]').then(($el) => {
        const initialTransform = $el.css('transform');

        // Scroll down
        cy.scrollTo(0, 500);

        // Transform should change
        cy.get('[data-testid="parallax-bg"]')
          .should('have.css', 'transform')
          .and('not.equal', initialTransform);
      });
    });
  });

  describe('Loading Animations', () => {
    it('should show loading spinner', () => {
      cy.visit('/bookings');

      cy.intercept('GET', '**/api/bookings', (req) => {
        req.reply((res) => {
          res.delay = 2000; // Add delay
          res.send();
        });
      }).as('getBookings');

      // Reload to trigger loading
      cy.reload();

      // Spinner should be visible
      cy.get('[data-testid="loading-spinner"]').should('be.visible');

      // Spinner should animate
      cy.get('[data-testid="loading-spinner"]')
        .should('have.css', 'animation-name')
        .and('include', 'spin');

      cy.wait('@getBookings');

      // Spinner should disappear
      cy.get('[data-testid="loading-spinner"]').should('not.exist');
    });

    it('should show skeleton loading states', () => {
      cy.visit('/bookings');

      cy.intercept('GET', '**/api/bookings', (req) => {
        req.reply((res) => {
          res.delay = 2000;
          res.send();
        });
      }).as('getBookings');

      cy.reload();

      // Skeleton should be visible
      cy.get('.skeleton').should('be.visible');

      // Skeleton should have shimmer animation
      cy.get('.skeleton')
        .should('have.css', 'animation-name')
        .and('include', 'shimmer');

      cy.wait('@getBookings');

      // Skeleton should be replaced with content
      cy.get('.skeleton').should('not.exist');
      cy.get('[data-testid^="booking-"]').should('be.visible');
    });

    it('should show progress bar for long operations', () => {
      cy.visit('/bookings/new');

      // Fill booking form
      cy.get('input[name="pickupAddress"]').type('Mumbai');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.get('input[name="deliveryAddress"]').type('Pune');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.intercept('POST', '**/api/bookings', (req) => {
        req.reply((res) => {
          res.delay = 3000;
          res.send();
        });
      }).as('createBooking');

      cy.get('[data-testid="next-step"]').click();
      cy.get('select[name="cargoType"]').select('general');
      cy.get('input[name="weight"]').type('10');
      cy.get('input[name="dimensions.length"]').type('20');
      cy.get('input[name="dimensions.width"]').type('20');
      cy.get('input[name="dimensions.height"]').type('20');
      cy.get('[data-testid="next-step"]').click();
      cy.get('[data-testid="next-step"]').click();
      cy.get('button[type="submit"]').click();

      // Progress bar should be visible
      cy.get('[data-testid="progress-bar"]').should('be.visible');

      // Progress should animate
      cy.get('[data-testid="progress-bar-fill"]')
        .should('have.css', 'width')
        .and('not.equal', '0px');

      cy.wait('@createBooking');

      // Progress bar should complete
      cy.get('[data-testid="progress-bar"]').should('not.exist');
    });
  });

  describe('Notification Animations', () => {
    it('should animate toast notifications', () => {
      cy.visit('/dashboard');

      // Trigger notification
      cy.window().then((win) => {
        win.socket.emit('notification', {
          type: 'success',
          message: 'Test notification'
        });
      });

      // Toast should slide in
      cy.get('.notification-toast')
        .should('be.visible')
        .and('have.css', 'animation-name')
        .and('include', 'slide');

      // Wait for auto-dismiss
      cy.wait(10000);

      // Toast should slide out
      cy.get('.notification-toast').should('not.be.visible');
    });

    it('should stack multiple notifications', () => {
      cy.visit('/dashboard');

      // Trigger multiple notifications
      cy.window().then((win) => {
        win.socket.emit('notification', { message: 'Notification 1' });
        win.socket.emit('notification', { message: 'Notification 2' });
        win.socket.emit('notification', { message: 'Notification 3' });
      });

      // All toasts should be visible and stacked
      cy.get('.notification-toast').should('have.length', 3);

      // Each should be positioned correctly
      cy.get('.notification-toast').each(($toast, index) => {
        cy.wrap($toast).should('be.visible');
      });
    });

    it('should animate notification badge', () => {
      cy.visit('/dashboard');

      // Check initial badge
      cy.get('[data-testid="notification-badge"]').should('not.exist');

      // Trigger notification
      cy.window().then((win) => {
        win.socket.emit('notification', { message: 'New message' });
      });

      // Badge should appear with animation
      cy.get('[data-testid="notification-badge"]')
        .should('be.visible')
        .and('have.css', 'animation-name')
        .and('include', 'bounce');
    });
  });

  describe('Form Animations', () => {
    it('should animate form validation errors', () => {
      cy.visit('/bookings/new');

      // Submit without filling required fields
      cy.get('[data-testid="next-step"]').click();

      // Error messages should appear with animation
      cy.get('.error-message')
        .should('be.visible')
        .and('have.css', 'animation-name')
        .and('include', 'shake');
    });

    it('should animate input focus', () => {
      cy.visit('/bookings/new');

      // Focus input
      cy.get('input[name="pickupAddress"]').focus();

      // Label should animate
      cy.get('label[for="pickupAddress"]')
        .should('have.css', 'transform')
        .and('not.equal', 'none');
    });

    it('should animate success state', () => {
      cy.visit('/profile');

      // Update profile
      cy.get('input[name="name"]').clear().type('New Name');

      cy.intercept('PUT', '**/api/user/profile').as('updateProfile');
      cy.get('button[type="submit"]').click();

      cy.wait('@updateProfile');

      // Success message should pulse
      cy.get('.success-message')
        .should('be.visible')
        .and('have.css', 'animation-name')
        .and('include', 'pulse');
    });

    it('should animate multi-step form progression', () => {
      cy.visit('/bookings/new');

      // Step 1 should be active
      cy.get('[data-testid="step-1"]').should('have.class', 'active');

      // Click next
      cy.get('input[name="pickupAddress"]').type('Mumbai');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.get('input[name="deliveryAddress"]').type('Pune');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.get('[data-testid="next-step"]').click();

      // Step 2 should animate in
      cy.get('[data-testid="step-2"]')
        .should('be.visible')
        .and('have.css', 'animation-name');

      // Step indicator should update with animation
      cy.get('[data-testid="step-indicator-2"]')
        .should('have.class', 'active')
        .and('have.css', 'transition-duration')
        .and('not.equal', '0s');
    });
  });

  describe('Interactive Animations', () => {
    it('should have smooth drag and drop', () => {
      cy.visit('/admin/dashboard');

      // Test draggable elements
      cy.get('[data-testid="draggable-widget"]').first().as('widget');

      // Drag widget
      cy.get('@widget').realMouseDown();

      // Should show drag preview
      cy.get('@widget')
        .should('have.css', 'opacity')
        .and('not.equal', '1');

      cy.get('@widget').realMouseMove(100, 100);
      cy.get('@widget').realMouseUp();

      // Should animate to new position
      cy.get('@widget')
        .should('have.css', 'transition-duration')
        .and('not.equal', '0s');
    });

    it('should animate accordion expand/collapse', () => {
      cy.visit('/help');

      // Expand accordion
      cy.get('[data-testid="accordion-item"]').first().click();

      // Content should expand with animation
      cy.get('[data-testid="accordion-content"]')
        .first()
        .should('be.visible')
        .and('have.css', 'max-height')
        .and('not.equal', '0px');

      // Collapse accordion
      cy.get('[data-testid="accordion-item"]').first().click();

      // Content should collapse
      cy.get('[data-testid="accordion-content"]')
        .first()
        .should('have.css', 'max-height', '0px');
    });

    it('should animate tabs switching', () => {
      cy.visit('/bookings');

      // Click different tab
      cy.get('[data-testid="tab-completed"]').click();

      // Tab content should fade in
      cy.get('[data-testid="tab-panel-completed"]')
        .should('be.visible')
        .and('have.css', 'animation-name')
        .and('include', 'fade');

      // Tab indicator should slide
      cy.get('[data-testid="tab-indicator"]')
        .should('have.css', 'transform')
        .and('not.equal', 'none');
    });
  });

  describe('Map Animations', () => {
    it('should animate map markers', () => {
      cy.visit('/bookings/new');

      cy.get('input[name="pickupAddress"]').type('Mumbai');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      // Marker should drop in with animation
      cy.get('.mapboxgl-marker')
        .should('be.visible')
        .and('have.css', 'animation-name')
        .and('include', 'drop');
    });

    it('should animate route drawing', () => {
      cy.visit('/bookings/new');

      cy.get('input[name="pickupAddress"]').type('Mumbai');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      cy.get('input[name="deliveryAddress"]').type('Pune');
      cy.wait(500);
      cy.get('.autocomplete-results').first().click();

      // Route should animate drawing
      cy.wait(1000);
      cy.get('.mapbox-gl-draw_line').should('exist');
    });

    it('should animate live tracking marker movement', () => {
      cy.createBookingViaAPI({
        pickupLocation: { address: 'Mumbai', coordinates: [72.8777, 19.0760] },
        deliveryLocation: { address: 'Pune', coordinates: [73.8567, 18.5204] },
        cargo: { type: 'general', weight: 10, dimensions: { length: 20, width: 20, height: 20 } },
        deliveryType: 'express'
      }).then((booking) => {
        cy.visit(`/bookings/${booking._id}`);

        // Simulate driver location updates
        const locations = [
          [72.8800, 19.0800],
          [72.9000, 19.1000],
          [72.9200, 19.1200]
        ];

        locations.forEach((location, index) => {
          cy.window().then((win) => {
            win.socket.emit('driver:locationUpdate', {
              bookingId: booking._id,
              location: { coordinates: location }
            });
          });

          cy.wait(1000);

          // Marker should smoothly move
          cy.get('.driver-marker')
            .should('have.css', 'transition-duration')
            .and('not.equal', '0s');
        });
      });
    });
  });

  describe('Celebration Animations', () => {
    it('should show confetti on delivery completion', () => {
      cy.intercept('GET', '**/api/bookings/*', {
        statusCode: 200,
        body: {
          success: true,
          booking: {
            status: 'completed',
            showCelebration: true
          }
        }
      }).as('getBooking');

      cy.visit('/bookings/test123');
      cy.wait('@getBooking');

      // Confetti should be visible
      cy.get('[data-testid="confetti"]').should('exist');

      // Confetti should animate
      cy.get('canvas').should('be.visible');
    });

    it('should animate success badge', () => {
      cy.visit('/profile');

      // Complete achievement
      cy.window().then((win) => {
        win.dispatchEvent(new CustomEvent('achievement', {
          detail: { badge: 'first-delivery' }
        }));
      });

      // Badge should bounce in
      cy.get('[data-testid="achievement-badge"]')
        .should('be.visible')
        .and('have.css', 'animation-name')
        .and('include', 'bounce');
    });
  });

  describe('Performance', () => {
    it('should maintain 60fps during animations', () => {
      cy.visit('/dashboard');

      // Monitor frame rate
      let frameCount = 0;
      let lastTime = performance.now();

      cy.window().then((win) => {
        const measureFPS = () => {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;

          if (delta >= 1000) {
            const fps = Math.round((frameCount * 1000) / delta);
            cy.log(`FPS: ${fps}`);
            expect(fps).to.be.at.least(55); // Allow small variance

            frameCount = 0;
            lastTime = currentTime;
          }

          frameCount++;
          requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
      });

      // Trigger animations
      cy.get('.card').each(($card) => {
        cy.wrap($card).realHover();
        cy.wait(100);
      });
    });

    it('should use GPU acceleration for animations', () => {
      cy.visit('/');

      // Check for GPU-accelerated properties
      cy.get('[data-testid="animated-element"]').should(($el) => {
        const style = window.getComputedStyle($el[0]);

        // Should use transform instead of left/top
        expect(style.transform).not.to.equal('none');

        // Should have will-change or transform
        const willChange = style.willChange;
        expect(willChange === 'transform' || willChange === 'auto').to.be.true;
      });
    });

    it('should respect prefers-reduced-motion', () => {
      // Simulate reduced motion preference
      cy.window().then((win) => {
        cy.stub(win, 'matchMedia').returns({
          matches: true,
          media: '(prefers-reduced-motion: reduce)'
        });
      });

      cy.visit('/dashboard');

      // Animations should be disabled or reduced
      cy.get('.card').first().should(($card) => {
        const animationDuration = window.getComputedStyle($card[0]).animationDuration;
        expect(animationDuration === '0s' || animationDuration === '0.01s').to.be.true;
      });
    });
  });

  describe('Accessibility', () => {
    it('should not cause seizures with flashing animations', () => {
      cy.visit('/dashboard');

      // No element should flash more than 3 times per second
      cy.get('[data-testid="animated-element"]').should(($el) => {
        const style = window.getComputedStyle($el[0]);
        const animationDuration = parseFloat(style.animationDuration);

        if (animationDuration > 0) {
          expect(animationDuration).to.be.at.least(0.33); // Max 3 flashes/second
        }
      });
    });

    it('should be keyboard accessible with animations', () => {
      cy.visit('/bookings');

      // Tab through elements
      cy.get('body').tab();
      cy.focused().should('be.visible');

      // Focus should be visible during animations
      cy.focused().should('have.css', 'outline-width').and('not.equal', '0px');
    });
  });
});
