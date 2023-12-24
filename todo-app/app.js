/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();

// const port = 4000;

const { Todo } = require("./models");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post("/todos", async (req, res) => {
  try {
    // console.log(req.body)
    const { title, dueDate } = req.body;
    console.log({ title, dueDate, completed: false });

    const todo = await Todo.addTodo({ title, dueDate });
    return res.status(200).json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByPk(id);
    const updateTodo = await todo.markAsCompleted();
    return res.json(updateTodo);
  } catch (error) {
    return res.status(422);
  }
});

app.get("/", function (request, response) {
  response.send("Hello World");
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.findAll();
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
