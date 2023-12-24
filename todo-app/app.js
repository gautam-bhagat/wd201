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
    return res.status(202).json(todo);
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

module.exports = app;
