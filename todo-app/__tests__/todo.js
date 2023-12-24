const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Create Todo", async () => {
    const res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    expect(res.statusCode).toBe(202);
  });
});
