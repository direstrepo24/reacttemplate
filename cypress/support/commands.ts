/// <reference types="cypress" />

// Import commands
import './commands.js';

// Add custom commands to Cypress
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="login-email"]').type(email);
  cy.get('[data-testid="login-password"]').type(password);
  cy.get('[data-testid="login-submit"]').click();
  
  // Wait for dashboard to load
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('hasFeature', (featureName: string) => {
  return cy.window().then(win => {
    // Access the feature flags store in the window context
    return win.hasOwnProperty('featureFlags') && 
      (win as any).featureFlags.isFeatureEnabled(featureName);
  });
});

Cypress.Commands.add('navigateTo', (menuItem: string) => {
  // Check if on mobile screen
  cy.viewport(Cypress.config('viewportWidth') as number, Cypress.config('viewportHeight') as number);
  
  // Check screen width to determine if mobile or desktop
  cy.window().then(win => {
    const isMobile = win.innerWidth < 768;
    
    if (isMobile) {
      // Open sidebar on mobile first
      cy.ensureSidebarState('open');
      cy.contains(menuItem).click();
    } else {
      // On desktop, just click the menu item
      cy.contains(menuItem).click();
    }
  });
});

Cypress.Commands.add('ensureSidebarState', (state: 'open' | 'closed') => {
  cy.get('body').then($body => {
    const isSidebarOpen = $body.find('[class*="translate-x-0"]').length > 0;
    
    if ((state === 'open' && !isSidebarOpen) || (state === 'closed' && isSidebarOpen)) {
      cy.get('button[aria-label="Toggle menu"]').click();
    }
  });
});

Cypress.Commands.add('toggleDarkMode', () => {
  // Look for the dark mode toggle button (sun/moon icon)
  cy.get('svg.h-5.w-5').first().click();
  
  // Verify dark mode toggle worked by checking if body has dark class
  cy.get('body').should('have.class', 'dark');
});

// Augment the Cypress namespace to include custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<Element>;
      hasFeature(featureName: string): Chainable<boolean>;
      navigateTo(menuItem: string): Chainable<Element>;
      ensureSidebarState(state: 'open' | 'closed'): Chainable<Element>;
      toggleDarkMode(): Chainable<Element>;
    }
  }
} 