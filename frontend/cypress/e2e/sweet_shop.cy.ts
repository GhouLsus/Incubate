const apiUrl = Cypress.env("apiUrl") as string;

const createAdminAndSweet = (sweetName: string, quantity: number) => {
  const adminEmail = `admin-${Date.now()}@example.com`;
  const adminPassword = "Admin123!";

  return cy
    .request("POST", `${apiUrl}/auth/register`, {
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    })
    .then((response) => {
      const accessToken = response.body.access_token as string;
      return cy
        .request({
          method: "POST",
          url: `${apiUrl}/sweets`,
          headers: { Authorization: `Bearer ${accessToken}` },
          body: {
            name: sweetName,
            category: "Assorted",
            description: "E2E test sweet",
            price: 4.5,
            quantity,
          },
        })
        .then(() => ({ adminEmail, adminPassword, accessToken }));
    });
};

describe("Sweet Shop flows", () => {
  it("registers, logs in, and purchases a sweet", () => {
    const uid = Date.now();
    const userEmail = `user-${uid}@example.com`;
    const userPassword = "User1234!";
    const sweetName = `Cypress Treat ${uid}`;
    const initialQuantity = 3;

    createAdminAndSweet(sweetName, initialQuantity).then(() => {
      cy.visit("/register");
      cy.get('input[name="name"]').type("Cypress User");
      cy.get('input[name="email"]').type(userEmail);
      cy.get('input[name="password"]').type(userPassword, { log: false });
      cy.get('select[name="role"]').select("Customer");
      cy.contains("Create account").click();

      cy.url().should("include", "/dashboard");

      cy.visit("/");
      cy.contains(sweetName)
        .parents('[data-cy^="sweet-card-"]')
        .as("selectedSweet");

      cy.get("@selectedSweet").within(() => {
        cy.contains(`Stock: ${initialQuantity}`);
        cy.get('[data-cy="sweet-purchase-button"]').click();
        cy.contains(`Stock: ${initialQuantity - 1}`);
      });
    });
  });

  it("allows admin to add a sweet and see it listed", () => {
    const uid = Date.now();
    const adminEmail = `admin-${uid}@example.com`;
    const adminPassword = "Admin123!";
    const sweetName = `Admin Sweet ${uid}`;

    cy.request("POST", `${apiUrl}/auth/register`, {
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    cy.visit("/login");
    cy.get('input[name="email"]').type(adminEmail);
    cy.get('input[name="password"]').type(adminPassword, { log: false });
    cy.contains("Sign in").click();

    cy.url().should("include", "/dashboard");

    cy.visit("/admin/sweets");
    cy.get('input[name="name"]').type(sweetName);
    cy.get('input[name="category"]').type("Seasonal");
    cy.get('input[name="price"]').clear().type("6.75");
    cy.get('input[name="quantity"]').clear().type("12");
    cy.get('textarea[name="description"]').type("Freshly added by Cypress");
    cy.contains("Create sweet").click();

    cy.contains("Sweet created successfully", { timeout: 10000 }).should("exist");
    cy.contains("td", sweetName, { timeout: 10000 }).should("exist");
  });
});
