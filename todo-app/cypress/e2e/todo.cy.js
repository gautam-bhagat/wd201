describe("My Todo List App", () => {
  const url = Cypress.env("STUDENT_SUBMISSION_URL") || "http://localhost:3000/";

  it("should have the title : Todo", () => {
    // Replace 'Expected Page Title' with the actual title of your page
    cy.visit(url);
    cy.title().should("include", "Todo");
  });

  it('should contain an h1 tag with the text "My Todo List"', () => {
    cy.visit(url);
    cy.get("h1").contains("My Todo List").should("be.visible");
  });

  it("should contain a signup link ", () => {
    cy.visit(url);
    cy.get('a[href="/signup"]')
      .should("be.visible")
      .and("contain", "Create an account");
  });

  it("should contain a login link with the correct text", () => {
    cy.visit(url);
    cy.get('a[href="/login"]')
      .should("be.visible")
      .and("contain", "Sign in here");
  });
});
