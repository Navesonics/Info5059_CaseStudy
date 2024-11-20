describe('Product CRUD Test', () => {

  //Create a new product
  it('visits the Products page and adds a Product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Product').click();

    cy.get('mat-icon.addicon').click();
    cy.contains('New product').should('be.visible');

    cy.get("[formcontrolname='id']").type('SHOE123');
    cy.get("[formcontrolname='name']").type('Gadget Pro');
    cy.get("[formcontrolname='vendorid']").click();
    cy.get('mat-option').contains('ABC Supply Co.').click();
    cy.get("[formcontrolname='costprice']").type('100.50');
    cy.get("[formcontrolname='msrp']").type('150.75');
    cy.get('.mat-expansion-indicator').eq(0).click();
    cy.get('.mat-expansion-indicator').eq(1).click();
    cy.get("[formcontrolname='rop']").type('50');
    cy.get("[formcontrolname='eoq']").type('100');
    cy.get("[formcontrolname='qoh']").type('200');
    cy.get("[formcontrolname='qoo']").type('50');

    cy.contains('button', 'Save').click();
    cy.contains('added!');
  });

  //Read (View) and update the product
  it('visits the Products page and updates a Product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Product').click();

    cy.contains('Gadget Pro').click();

    cy.get("[formcontrolname='msrp']").clear().type('175.00');  // Update MSRP
    cy.get('.mat-expansion-indicator').eq(0).click();
    cy.get('.mat-expansion-indicator').eq(1).click();
    cy.get("[formcontrolname='qoh']").clear().type('300');  // Update QOH


     cy.contains('button', 'Save').click();
    cy.contains('updated!');
  });

  // Delete the product
  it('visits the Products page and deletes a Product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'Product').click();

    cy.contains('Gadget Pro').click();

    cy.contains('button', 'Delete').should('be.visible').click();
    cy.contains('deletion complete');
  });

});
