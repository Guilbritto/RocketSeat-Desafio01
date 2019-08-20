const express = require("express");

const server = express();
server.use(express.json());

projects = [];
requestNumber = 0;
server.use((req, res, next) => {
  requestNumber++;
  console.log(`This is a request number ${requestNumber}`);
  return next();
});

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  projects.find((element, index) => {
    if (element.id == id) {
      req.projectIndex = index;
    }
  });

  if (req.projectIndex == undefined) {
    return res.status(400).json({ message: "Project not found! " });
  }
  return next();
}

server.get("/projects", (req, res) => {
  res.send(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  res.send(projects);
});

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.projectIndex].tasks.push(title);

  res.send(projects);
});

server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { title } = req.body;

  projects[req.projectIndex].title = title;

  return res.send(projects);
});

server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  projects.splice(req.projectIndex, 1);

  res.send();
});

server.listen(3000);
