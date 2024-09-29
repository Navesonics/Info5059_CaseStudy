describe('employee update test', () => {
  it('visits the employee page and updates an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'employees').click();
    cy.contains('Slick').click(); // replace Slick with your own name
    cy.get("[type='email']").clear();
    cy.get("[type='email']").type('someemail@domain.com');
    cy.get('form').submit();
    cy.contains('updated!');
  });
});
