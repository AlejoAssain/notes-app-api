import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { usersRouter } from "./routes/users.js";
import { projectsRouter } from "./routes/projects.js"
import { notesRouter } from "./routes/notes.js";


dotenv.config();
//
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {useNewUrlParser: true})
  .then( () => console.log("Database connected...") )
  .catch( e => console.log("Error: " + e));

mongoose.connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const app = express();
const port = 4000;

// CHANGE THIS
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));

app.use("/users", usersRouter);
app.use("/notes", notesRouter);
app.use("/projects", projectsRouter);

app.listen(port, () => {
  console.log(`\n\nServer started on port: ${port}`);
});
