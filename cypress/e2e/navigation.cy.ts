describe('Navigation', () => {
  beforeEach(() => {
    // Login first
    cy.visit('/login');
    cy.get('[data-testid="login-email"]').type('test@example.com');
    cy.get('[data-testid="login-password"]').type('password123');
    cy.get('[data-testid="login-submit"]').click();
    
    // Ensure we're on the dashboard
    cy.url().should('include', '/dashboard');
  });

  it('navigates to Analytics page', () => {
    // For desktop navigation
    cy.viewport(1200, 800);
    
    // Find and click the Analytics link in the navigation
    cy.contains('Analytics').click();
    
    // Verify we navigated to the analytics page
    cy.url().should('include', '/dashboard/analytics');
    cy.contains('Analytics Dashboard').should('be.visible');
  });

  it('navigates to Reports page', () => {
    // For desktop navigation
    cy.viewport(1200, 800);
    
    // Find and click the Reports link in the navigation
    cy.contains('Reports').click();
    
    // Verify we navigated to the reports page
    cy.url().should('include', '/dashboard/reports');
    cy.contains('Generate and view reports').should('be.visible');
  });

  it('uses mobile navigation for small screens', () => {
    // For mobile navigation
    cy.viewport(375, 667);
    
    // Open the mobile menu
    cy.get('button[aria-label="Toggle menu"]').click();
    
    // Find and click a link in the mobile menu
    cy.contains('Analytics').click();
    
    // Verify we navigated to the analytics page
    cy.url().should('include', '/dashboard/analytics');
  });
}); 