//declaring variables
const express = require("express");
const app = express();
const PORT = 3333;
const fs = require("fs");
const path = require("path");

//required middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET Requests
//when request is sent, response includes the html

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//listening at port: ${PORT}
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
