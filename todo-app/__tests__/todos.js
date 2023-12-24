/* eslint-disable no-undef */
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

    expect(res.statusCode).toBe(200);
    let parsedResponse = JSON.parse(res.text);

    expect(parsedResponse.completed).toBe(false);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    let len = parsedResponse.length >= 2;
    // if(parsedResponse.length)
    expect(len).toBe(true);
    // expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  });

  test("mark todo as completed", async () => {
    let res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    expect(res.statusCode).toBe(200);

    let parsedResponse = JSON.parse(res.text);
    const id = parsedResponse.id;

    res = await agent.put(`/todos/${id}/markAsCompleted`).send();
    parsedResponse = JSON.parse(res.text);
    expect(parsedResponse.completed).toBe(true);
  });

  test("Delete Todo", async () => {
    let res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    expect(res.statusCode).toBe(200);
    let parsedResponse = JSON.parse(res.text);
    const id = parsedResponse.id;
    res = await agent.delete(`/todos/${id}`).send();
    parsedResponse = JSON.parse(res.text);
    expect(parsedResponse).toBe(true);
  });
});
