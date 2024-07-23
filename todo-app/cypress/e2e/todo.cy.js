describe("template spec", () => {
  it('Visitable and contains h1 with text "My Todo List"', () => {
    // Get the URL from the environment variable
    const url = Cypress.env("STUDENT_SUBMISSION_URL");

    // Visit the URL
    cy.visit(url);

    // Check the title of the page (optional)
    // cy.title().should('include', 'Expected Page Title'); // Replace with the expected title

    // Check if an h1 tag contains the text "My Todo List"
    cy.get("h1").contains("My Todo List").should("be.visible");
  });
});
