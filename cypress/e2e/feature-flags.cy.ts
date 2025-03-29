/// <reference types="cypress" />

describe('Feature Flags Integration', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/');
    cy.get('[data-testid="email-input"]').type('admin@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    // Check we're logged in and on the dashboard
    cy.url().should('include', '/dashboard');
  });

  it('should display menu items based on enabled feature flags', () => {
    // Check that feature-flagged menu items are displayed when enabled
    cy.contains('Users').should('exist');
    cy.contains('Settings').should('exist');
    
    // Click on Users to expand submenu
    cy.contains('Users').click();
    cy.contains('User Profiles').should('exist');
    cy.contains('User Roles').should('exist');
    
    // Click on Settings to expand submenu
    cy.contains('Settings').click();
    cy.contains('General').should('exist');
    cy.contains('Security').should('exist');
  });

  it('should navigate to feature-flagged pages when enabled', () => {
    // Navigate to User Roles page
    cy.contains('Users').click();
    cy.contains('User Roles').click();
    cy.url().should('include', '/users/roles');
    cy.get('h1').should('contain', 'User Roles');
    
    // Navigate to General Settings page
    cy.contains('Settings').click();
    cy.contains('General').click();
    cy.url().should('include', '/settings/general');
    cy.get('h1').should('contain', 'General Settings');
    
    // Navigate to Security Settings page
    cy.contains('Settings').click();
    cy.contains('Security').click();
    cy.url().should('include', '/settings/security');
    cy.get('h1').should('contain', 'Security Settings');
  });
  
  it('should hide menu items when feature flags are disabled', () => {
    // Mock the feature flag API to disable certain features
    cy.intercept('GET', '/api/feature-flags', (req) => {
      req.reply({
        flags: {
          USER_MANAGEMENT: true,
          USER_PROFILES: true,
          USER_ROLES: false, // Disable user roles
          SETTINGS: true,
          GENERAL_SETTINGS: true,
          SECURITY_SETTINGS: false // Disable security settings
        }
      });
    }).as('getFeatureFlags');
    
    // Reload the page to apply new feature flags
    cy.reload();
    cy.wait('@getFeatureFlags');
    
    // Check that User Roles is not visible
    cy.contains('Users').click();
    cy.contains('User Profiles').should('exist');
    cy.contains('User Roles').should('not.exist');
    
    // Check that Security Settings is not visible
    cy.contains('Settings').click();
    cy.contains('General').should('exist');
    cy.contains('Security').should('not.exist');
  });
  
  it('should apply styling based on style feature flags', () => {
    // Check that neumorphism styling is applied when that feature flag is enabled
    cy.get('nav').should('have.class', 'shadow-neumorph');
    cy.get('button').first().should('have.class', 'shadow-neumorph');
    
    // Mock the feature flag API to disable neumorphism
    cy.intercept('GET', '/api/feature-flags', (req) => {
      req.reply({
        flags: {
          USE_NEUMORPHISM: false,
          // Include other flags to keep them enabled
          USER_MANAGEMENT: true,
          USER_PROFILES: true,
          USER_ROLES: true,
          SETTINGS: true
        }
      });
    }).as('getFeatureFlags');
    
    // Reload the page to apply new feature flags
    cy.reload();
    cy.wait('@getFeatureFlags');
    
    // Check that neumorphism styling is not applied
    cy.get('nav').should('not.have.class', 'shadow-neumorph');
    cy.get('button').first().should('not.have.class', 'shadow-neumorph');
  });
  
  it('should support dark mode when feature flag is enabled', () => {
    // Body should not have dark class by default
    cy.get('body').should('not.have.class', 'dark');
    
    // Mock the feature flag API to enable dark mode
    cy.intercept('GET', '/api/feature-flags', (req) => {
      req.reply({
        flags: {
          USE_DARK_MODE: true,
          USE_NEUMORPHISM: true,
          // Include other flags to keep them enabled
          USER_MANAGEMENT: true,
          USER_PROFILES: true,
          USER_ROLES: true,
          SETTINGS: true
        }
      });
    }).as('getFeatureFlags');
    
    // Reload the page to apply new feature flags
    cy.reload();
    cy.wait('@getFeatureFlags');
    
    // Dark mode toggle should be visible
    cy.get('[data-testid="dark-mode-toggle"]').should('exist');
    
    // Click the dark mode toggle
    cy.get('[data-testid="dark-mode-toggle"]').click();
    
    // Body should have dark class after toggle
    cy.get('body').should('have.class', 'dark');
    
    // Colors should be appropriate for dark mode
    cy.get('nav').should('have.css', 'background-color', 'rgb(31, 41, 55)'); // bg-gray-800
  });
}); 