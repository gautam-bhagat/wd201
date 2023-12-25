/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio");

let server, agent;
let csrfToken;
const extractCSRF = (res) => {
  let $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
};

describe("Todo Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("Create Todo", async () => {
    const r = await agent.get("/");
    csrfToken = extractCSRF(r);

    const res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    expect(res.statusCode).toBe(302);
  });

  // test("Fetches all todos in the database using /todos endpoint", async () => {
  //   await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     _csrf : csrfToken
  //   });
  //   await agent.post("/todos").send({
  //     title: "Buy ps3",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     _csrf : csrfToken
  //   });
  //   const response = await agent.get("/todos");
  //   const parsedResponse = JSON.parse(response.text);

  //   let len = parsedResponse.length >= 2;
  //   // if(parsedResponse.length)
  //   expect(len).toBe(true);
  //   // expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  // });

  test("mark todo as completed", async () => {
    const r = await agent.get("/");
    const csrfToken = extractCSRF(r);
    let res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    let allTodos = await agent.get("/").set("Accept", "application/json");

    allTodos = JSON.parse(allTodos.text);
    let todosToday = allTodos.duetoday[allTodos.duetoday.length - 1];

    const id = todosToday.id;

    res = await agent.put(`/todos/${id}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    parsedResponse = JSON.parse(res.text);
    expect(parsedResponse.completed).toBe(true);
  });

  test("Delete Todo", async () => {
    const r = await agent.get("/");
    const csrfToken = extractCSRF(r);
    let res = await agent.post("/todos").send({
      title: "title",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    let allTodos = await agent.get("/").set("Accept", "application/json");

    allTodos = JSON.parse(allTodos.text);
    let todosToday = allTodos.duetoday[allTodos.duetoday.length - 1];

    const id = todosToday.id;

    res = await agent.delete(`/todos/${id}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    parsedResponse = JSON.parse(res.text);
    expect(parsedResponse).toBe(true);
  });
});
