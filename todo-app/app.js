/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();

// const port = 4000;

const { Todo } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Secret_Token"));
app.use(csrf({ cookie: true }));

app.set("view engine", "ejs");

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  const d = new Date().toISOString().substring(0, 10);

  const todos = await Todo.findAll();
  const overdue = todos.filter((item) => {
    return item.dueDate < d && item.completed === false;
  });
  const duetoday = todos.filter((item) => {
    return item.dueDate === d && item.completed === false;
  });
  const duelater = todos.filter((item) => {
    return item.dueDate > d && item.completed === false;
  });

  const completedtodo = todos.filter((item) => {
    return item.completed;
  });
  if (request.accepts("html")) {
    return response.render("index", {
      todos,
      overdue,
      duetoday,
      duelater,
      completedtodo,
      csrfToken: request.csrfToken(),
    });
  } else {
    return response.json({ todos, overdue, duetoday, duelater, completedtodo });
  }
});

app.post("/todos", async (req, res) => {
  try {
    // console.log(req.body)
    const { title, dueDate } = req.body;
    console.log({ title, dueDate, completed: false });

    const todo = await Todo.addTodo({ title, dueDate });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByPk(id);
    const { completed } = req.body;
    const updateTodo = await todo.setCompletionStatus(completed);
    return res.json(updateTodo);
  } catch (error) {
    return res.status(422);
  }
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const d = new Date().toISOString().substring(0, 10);
    console.log(d);
    const todos = await Todo.findAll();
    const overdue = todos.filter((item) => {
      return item.dueDate < d;
    });
    const duetoday = todos.filter((item) => {
      return item.dueDate === d;
    });
    const duelater = todos.filter((item) => {
      return item.dueDate > d;
    });
    console.log("OverDue", JSON.stringify(overdue));
    console.log("DueToday", JSON.stringify(duetoday));
    console.log("DueLater", JSON.stringify(duelater));

    return response.send(todos);
  } catch (error) {
    response.status(422).send(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    const dData = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    console.log(dData);
    if (dData === 1) {
      return response.send(true);
    } else {
      return response.send(false);
    }
  } catch (error) {
    response.send(false).status(422);
  }
});

module.exports = app;
