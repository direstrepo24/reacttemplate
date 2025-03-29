describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays the login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="login-email"]').should('be.visible');
    cy.get('[data-testid="login-password"]').should('be.visible');
    cy.get('[data-testid="login-submit"]').should('be.visible');
  });

  it('shows an error with invalid credentials', () => {
    cy.get('[data-testid="login-email"]').type('invalid@example.com');
    cy.get('[data-testid="login-password"]').type('wrongpassword');
    cy.get('[data-testid="login-submit"]').click();
    
    // Wait for the error to appear
    cy.get('[data-testid="login-error"]', { timeout: 5000 }).should('be.visible');
  });

  it('logs in successfully with correct credentials', () => {
    cy.get('[data-testid="login-email"]').type('test@example.com');
    cy.get('[data-testid="login-password"]').type('password123');
    cy.get('[data-testid="login-submit"]').click();
    
    // After successful login, user should be redirected to dashboard
    cy.url().should('include', '/dashboard');
  });
}); 