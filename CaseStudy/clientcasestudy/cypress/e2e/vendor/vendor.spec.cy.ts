describe('vendor page test', () => {
  it('Visits the vendor project page', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Vendor').click();
    cy.contains('vendors loaded!!');
  });
});
