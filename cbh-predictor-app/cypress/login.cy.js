describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/login')
  })
})

it("checks if Username Field  works", () => {
  cy.visit("http://localhost:3000/login")  
  cy.get("[id=0001]")
    .click()
  cy.get("[id=0001]")
    .type("name")
})

it("checks if Password Field works", () => {
  cy.visit("http://localhost:3000/login")  
  cy.get("[id=0002]")
    .click()
  cy.get("[id=0002]")
    .type("Password")
})


it("checks if Login Button works", () => {
  cy.visit("http://localhost:3000/login")  
  cy.get("[id=0003]")
    .click()
})

it("checks if complete Login Works", () => {
  cy.visit("http://localhost:3000/login")  
  cy.get("[id=0001]")
    .click()
  cy.get("[id=0001]")
    .type("name")
   
  cy.get("[id=0002]")
    .click()
  cy.get("[id=0002]")
    .type("Password")
  
  cy.get("[id=0003]")
    .click()
})