const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
morgan.token("body", function (req, res) {
  const body = req.body;
  return Object.keys(body).length !== 0 ? JSON.stringify(req.body) : " ";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === Number(req.params.id));
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const id = Math.floor(Math.random() * 1000000);
  const body = req.body;
  if (!body.name || !body.number) {
    res.status(400).json({
      error: "no or invalid name",
    });
  }
  const existedPerson = persons.find((person) => person.name === body.name);
  if (existedPerson) {
    res.status(400).json({
      error: "person already exists",
    });
  }
  const person = {
    id,
    name: req.body.name || "default name",
    number: req.body.number || "default number",
  };
  persons = persons.concat(person);
  res.status(201).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(204).end();
});

app.get("/info", (req, res) => {
  console.log("req", req);
  const size = persons.length;
  const now = new Date();
  res.end(
    `<div> <p>Phonebook has info for ${size} people</p><p>${now}</p> </div>`
  );
});

app.listen(8089);
console.log("Server listening on port 8089");
