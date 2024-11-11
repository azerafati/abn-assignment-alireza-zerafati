describe('Registration Form', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Routing works', () => {
    cy.contains('Registration Form')
  })

  it('Displays validation messages for empty required fields', () => {
    cy.get('button[data-testid="submit"]').click()
    cy.get('mat-error').should('contain', 'Username is required')
    cy.get('mat-error').should('contain', 'Email is required')
    cy.get('mat-error').should('contain', 'Password is required')
  })

  it('Displays validation message for invalid email', () => {
    cy.get('input[data-testid="email"]').type('invalid-email')
    cy.get('button[data-testid="submit"]').click()
    cy.get('mat-error').should('contain', 'Please enter a valid email address')
  })

  it('Displays validation message for weak passwords', () => {
    const weakPasswords = ['weak', '12345', 'password', 'abc']
    weakPasswords.forEach(password => {
      cy.get('input[data-testid="password"]').clear().type(password)
      cy.get('button[data-testid="submit"]').click()
      cy.get('mat-error').should('contain', 'Password is weak')
    })
  })

  it('Submits the form with valid data', () => {
    cy.intercept('POST', '/api/register').as('register')
    cy.get('input[data-testid="username"]').type('myuser')
    cy.get('input[data-testid="email"]').type('user@example.com')
    cy.get('input[data-testid="password"]').type('Password123!')
    cy.get('button[data-testid="submit"]').click()
    cy.get('mat-progress-bar').should('exist')
    cy.wait('@register').then(({ response }) => {
      expect(response?.statusCode).to.equal(200)
      expect(response?.body['message']).to.equal('Registration data received successfully')
    })
  })
})
