describe('empty spec', () => {
  it('passes', () => {
    cy.visit('/')
  })
})

it("opens sidebar and checks all buttons", () => {
  cy.visit("/")
  cy.get("[id=0004]")
    .click()
  cy.get("[id=0005]")
    .click()

  cy.get("[id=0004]")
    .click()
  cy.get("[id=0006]")
    .click()

  cy.get("[id=0004]")
    .click()
  cy.get("[id=0007]")
    .click()

  cy.get("[id=0004]")
    .click()
  cy.get("[id=0008]")
    .click()

  cy.get("[id=0004]")
    .click()
  cy.get("[id=0009]")
    .click()

  cy.get("[id=0004]")
    .click()
  cy.get("[id=0010]")
    .click()

  cy.get("[id=0004]")
    .click()
  cy.get("[id=0011]")
    .click()

  cy.get("[id=0004]")
    .click()
  cy.get("[id=0012]")
    .click()
})