describe('vendor update test', () => {
  it('visits the vendors page and update an vendor', () => {
  cy.visit('/');
  cy.get('button').click();
  cy.contains('a', 'Vendor').click();
  cy.contains('EvanWilson').click();
  cy.get("[type='email']").clear();
  //cy.get("[type='email']").type('ewb@updateddomain.com');
  cy.get("[type='email']").type('ewb@abc.com');
  cy.get('form').submit();
  cy.contains('updated!');
  })
});
