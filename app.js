const express = require("express");
const Joi = require("joi");

const app = express();
const courses = [
  { id: 1, name: "Computer science 101" },
  { id: 2, name: "Backend development with node.js" },
  { id: 3, name: "Frontend development with react" },
  { id: 4, name: "Database design with mongoDB" },
];

app.use(express.json());

app.get("/", (req, res) => res.send("<h1>Hello there</h1>"));

app.get("/api/v1/courses", (req, res) => res.send(courses));
app.get("/api/v1/courses/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id was not found");
  res.send(course);
});
app.post("/api/v1/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  //if invalid, return 400 - bad request
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/v1/courses/:id", (req, res) => {
  //lookup course
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  //if course does not exist, return 404
  if (!course)
    return res.status(404).send("The course with the given id was not found");

  const { error } = validateCourse(req.body);
  //if invalid, return 400 - bad request
  if (error) return res.status(400).send(error.details[0].message);

  //update course
  course.name = req.body.name;
  //return updated course
  res.send(course);
});

function validateCourse(course) {
  //validate
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}
app.delete("/api/v1/courses/:id", (req, res) => {
  //lookup course
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  //if course does not exist, return 404
  if (!course)
    return res.status(404).send("The course with the given id was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  return res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
