// Test menu integration with feature flags
describe('Menu Integration with Feature Flags', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'password123');
  });

  it('should display menu items based on feature flags', () => {
    // Check if dashboard menu is visible since we're on dashboard
    cy.contains('Dashboard').should('be.visible');
    
    // Check if the user profiles link is visible (should be enabled by default)
    cy.contains('User Profiles').should('exist');
    
    // Check if we can navigate to user profiles
    cy.navigateTo('User Profiles');
    cy.url().should('include', '/users/profiles');
    cy.contains('User Profiles').should('be.visible');
    cy.contains('Manage user profiles and information').should('be.visible');
    
    // Verify we can navigate to Settings
    cy.navigateTo('Settings');
    cy.contains('General Settings').should('exist');
    cy.contains('Security Settings').should('exist');
    
    // Navigate to a settings page
    cy.navigateTo('General Settings');
    cy.url().should('include', '/settings/general');
    cy.contains('Configure general system settings').should('be.visible');
  });

  it('should hide menu items when feature flags are disabled', () => {
    // This test would typically involve modifying the feature flags
    // For testing purposes, we'll mock a feature being disabled by checking if an item is absent
    
    // We'll use a stub to simulate a feature being disabled
    cy.window().then(win => {
      // Create a backup of the real function
      const originalFeatureEnabled = (win as any).isFeatureEnabled;
      
      // Replace with our stub that disables one feature
      (win as any).isFeatureEnabled = (flag: string) => {
        if (flag === 'DASHBOARD_REPORTS') {
          return false;
        }
        // For other flags, use the original function
        return originalFeatureEnabled(flag);
      };
      
      // Now reload to apply our changes
      cy.reload();
      
      // The Reports section should be hidden
      cy.contains('Reports').should('not.exist');
      
      // Restore the original function
      (win as any).isFeatureEnabled = originalFeatureEnabled;
    });
  });

  it('should handle responsive navigation on different screen sizes', () => {
    // Test desktop navigation
    cy.viewport(1200, 800);
    cy.navigateTo('User Profiles');
    cy.url().should('include', '/users/profiles');
    
    // Test tablet navigation
    cy.viewport(768, 1024);
    cy.navigateTo('User Roles');
    cy.url().should('include', '/users/roles');
    
    // Test mobile navigation
    cy.viewport(375, 667);
    // On mobile, menu should be hidden initially
    cy.get('[class*="-translate-x-full"]').should('exist');
    
    // Open menu
    cy.get('button[aria-label="Toggle menu"]').click();
    cy.get('[class*="translate-x-0"]').should('exist');
    
    // Navigate to a page
    cy.contains('Settings').click();
    cy.contains('General Settings').click();
    cy.url().should('include', '/settings/general');
  });

  it('should toggle dark mode and maintain preference', () => {
    // Initial state should not be dark
    cy.get('body').should('not.have.class', 'dark');
    
    // Toggle dark mode
    cy.toggleDarkMode();
    
    // Body should now have dark class
    cy.get('body').should('have.class', 'dark');
    
    // Navigate to another page to see if dark mode persists
    cy.navigateTo('User Profiles');
    cy.get('body').should('have.class', 'dark');
    
    // Toggle dark mode back
    cy.toggleDarkMode();
    cy.get('body').should('not.have.class', 'dark');
  });
}); 