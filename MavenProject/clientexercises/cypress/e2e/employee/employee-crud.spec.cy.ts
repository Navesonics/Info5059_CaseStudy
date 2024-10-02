describe('employee update test', () => {
  it('visits the employee page and adds an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'employees').click();
    cy.get('mat-icon.addicon').click();
    cy.contains('New Employee').should('be.visible');
    cy.get("[formControlName='title']").type('Mr.');
    cy.get("[formControlName='firstname']").focus().type('Test');
    cy.get("[formControlName='lastname']").focus().type('Example');
    cy.get("[formControlName='phoneno']").focus().type('(555)555-8888');
    cy.get("[formControlName='email']").focus().type('te@testing.com');
    cy.get('form').submit();
    cy.contains('added!');
  });

  it('visits the employee page and updates an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'employees').click();
    cy.contains('Test').click();
    cy.get("[type='email']").clear();
    cy.get("[type='email']").type('someemail@domain.com');
    //cy.get('form').submit();
    cy.contains('button', 'Save').click();
    cy.contains('updated!');
  });

  it('visits the employee page and deletes an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'employees').click();
    cy.contains('Example').click();
    cy.contains('button', 'Delete').should('be.visible').click();
    cy.contains('deleted!');
  });
});
