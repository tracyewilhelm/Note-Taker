//declaring variables
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3333;
const fs = require("fs");
const path = require("path");
const notes = require("./db/db.json");
const uuid = require("./helpers/uuid");
const util = require("util");

//required middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET Requests
//when button is clicked, send user to the notes.html page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// route for homepage if anything other than notes is put in

//GET req for notes; sends mssg to client; sends mssg to console
app.get("/api/notes", (req, res) => {
  //sends message to client - no hanging server request
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.info(err);
    } else {
      const oldNotes = JSON.parse(data);
      res.json(oldNotes);
    }
  });
});

// app.get("/api/notes", (req, res) => {
//   return res.json(notes); //- this says when they hit the /api/notes then to return the notes info that was previously logged
// });
const readFromFile = util.promisify(fs.readFile);
//POST Requests to add a note
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content), (err) =>
    err
      ? console.error(err)
      : console.info(`\nData written to ${destination} line 40`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET Route for retrieving all the notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);

  res.json(notes);
  // readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

// GET Route for retrieving all the notes
app.get("/api/note", (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route for submitting note
app.post("/api/note", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to submit note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,

      feedback_id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting note");
  }
});
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//listening at port: ${PORT}
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

//make sure you send a respose after you've made the post so the front end knows something happened

//app.use("api", api) - do i need to use this?

//notes: use uuid to mark each note with an id that you can use to identify and delete specific notes
