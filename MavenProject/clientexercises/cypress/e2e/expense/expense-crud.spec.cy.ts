describe('Expense CRUD test', () => {
  it('Visits the expense page and adds an expense', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Expenses').click();
    cy.contains('control_point').click();
    cy.get('mat-select[formcontrolname="employeeid"]').click();
    cy.get('mat-option').contains('Pincher').click(); // If it fails, refresh the test (Ctrl + R)
    cy.get('mat-select[formcontrolname="categoryid"]').click({ force: true });
    cy.get('mat-option').contains('Travel').click();
    cy.get('input[formcontrolname=description')
      .click({ force: true })
      .type('Bought Gas');
    cy.get('input[formcontrolname=amount').click({ force: true }).type('23.99');
    cy.get('input[formcontrolname=dateincurred')
      .click({ force: true })
      .type('11/01/2023');
    cy.get('button').contains('Save').click();
    cy.contains('added!'); // Make sure it matches the msg from your code
  });

    it('Visits the expense page and updates the created expense', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Expenses').click();
    cy.contains('01/11/2023').click();
    cy.get('input[formcontrolname=amount').clear();
    cy.get('input[formcontrolname=amount').click({ force: true }).type('25.00');
    cy.get('button').contains('Save').click();
    cy.contains('updated!'); // Make sure it matches the msg from your code
  });

  it('Visits the expense page and Delete the created expense', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Expenses').click();
    cy.contains('01/11/2023').click();
    cy.get('button').contains('Delete').should('be.visible').click();
    cy.contains('deleted!');
  });
});
