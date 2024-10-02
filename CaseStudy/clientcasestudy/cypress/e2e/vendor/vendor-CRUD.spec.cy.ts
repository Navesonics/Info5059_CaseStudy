describe('Vendor update test', () => {
  it('visits the Vendors page and adds an Vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Vendor').click();
    cy.get('mat-icon.addicon').click();
    cy.contains('New Vendor').should('be.visible');
    cy.get("[type='name']").type('Widget Shack');
    cy.get("[type='address1']").type('123 Pine');
    cy.get("[type='city']").type('London');
    cy.get("[type='phone']").type('(555)555-555)');
    cy.get("[type='email']").type('ws@shacl.com');
    cy.get('mat-select[formcontrolname="province"]').click({ force: true });
    cy.get('mat-option').contains('Ontario').click();
    cy.get('mat-select[formcontrolname="type"]').click({ force: true });
    cy.get('mat-option').contains('Trusted').click();
    cy.get("[type='postalcode']").type('N1N-1N1', { force: true });
    cy.get('form').submit();
    cy.contains('added!');
  });

  it('visits the Vendors page and updates an Vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Vendor').click();
    cy.contains('Widget Shack').click();
    cy.get("[type='email']").clear();
    cy.get("[type='email']").type('someemail@domain.com');
    cy.get('form').submit();
    cy.contains('updated!');
  });

  it('visits the Vendors page and deletes an Vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Vendor').click();
    cy.contains('Widget Shack').click();
    cy.contains('button', 'Delete').should('be.visible').click();
    cy.contains('deleted!');
  });
});
