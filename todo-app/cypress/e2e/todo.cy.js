let baseUrl = Cypress.env("URL") || "http://localhost:3000";
if (baseUrl.endsWith("/")) {
  baseUrl = baseUrl.slice(0, -1);
}

describe("My Todo List App", () => {
  it("should have the title : Todo", () => {
    // Replace 'Expected Page Title' with the actual title of your page
    cy.visit(baseUrl);
    cy.title().should("include", "Todo");
  });

  it('should contain an h1 tag with the text "My Todo List"', () => {
    cy.visit(baseUrl);
    cy.get("h1").contains("My Todo List").should("be.visible");
  });

  it("should contain a signup link ", () => {
    cy.visit(baseUrl);
    cy.get('a[href="/signup"]')
      .should("be.visible")
      .and("contain", "Create an account");
  });

  it("should contain a login link ", () => {
    cy.visit(baseUrl);
    cy.get('a[href="/login"]')
      .should("be.visible")
      .and("contain", "Sign in here");
  });
});

const uniqueEmail = `john.doe${Date.now()}@example.com`;

describe("Authentication", () => {
  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe("Signup", () => {
    it("should successfully create a new account", () => {
      cy.visit(`${baseUrl}/signup`);
      cy.get('input[name="firstName"]').type("John");
      cy.get('input[name="lastName"]').type("Doe");
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type("password123");

      // Intercept the POST request
      cy.intercept("POST", `${baseUrl}/users`).as("signupRequest");

      cy.get('button[type="submit"]').click();

      cy.wait("@signupRequest").then((interception) => {
        expect(interception.response.statusCode).to.eq(302);
      });

      // Check if redirected to todos page after successful signup
      cy.url().should("include", "/todos");
    });
  });

  describe("Signin", () => {
    it("should successfully sign in with correct credentials", () => {
      cy.visit(`${baseUrl}/login`);
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type("password123");
      cy.get('button[type="submit"]').click();

      // Check if redirected to todos page after successful signin
      cy.url().should("include", "/todos");
    });
  });
});
