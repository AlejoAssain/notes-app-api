import { Note } from "../models/note.model.js";
import { getProject } from "./projectController.js";
import { getUser } from "./userController.js";


const deleteSpaces = word => word.split(" ").join("");

const generateNoteName = noteTitle => deleteSpaces(noteTitle).toLowerCase();

export const getNote = async (noteName, projectId) => {
  const note = await Note.findOne( { name: noteName, project_id: projectId } );
  return note;
};

export const getNotesOfProject = async (req, res) => {
  const { projectName } = req.params;

  try {
    const { _id: projectId } = await getProject(projectName, req.user._id);

    const notes = await Note.find( { project_id: projectId });

    res.json(notes);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const createNote = async (req, res) => {
  const {
    projectName,
    title: noteTitle,
    content: noteContent,
    priority: notePriority,
  } = req.body;

  try {
    const { _id: projectId } = await getProject(projectName, req.user._id);

    const newNote = new Note({
      name: generateNoteName(noteTitle),
      title: noteTitle,
      content: noteContent,
      priority: Number(notePriority),
      project_id: projectId,
      completed: false,
      assigned_user_id: null
    });

    await newNote.save();

    console.log("Note created");

    res.json(newNote);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const assignUser = async (req, res) => {
  const {
    projectName,
    usernameToAssign,
    noteName
  } = req.body;

  try {
    const { _id: userIdToAssign } = await getUser(usernameToAssign);

    const project = await getProject(projectName, req.user._id);

    if ( project.participants_id.includes(userIdToAssign) ) {
      const note = await getNote(noteName, project._id);

      note.assigned_user_id = userIdToAssign;

      await note.save();

      res.json(note);
      console.log(note);
    } else {
      throw new Error("User tried to assign is not a participant of this project");
    }

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const updateNote = async (req, res) => {
  const {
    noteName,
    projectName,
    ...newAttrs
  } = req.body;

  try {
    const { _id: projectId } = await getProject(projectName, req.user._id);

    const note = await getNote(noteName, projectId);

    if (!note) {
      throw new Error("Note not found!")
    }

    Object.assign(note, newAttrs);

    if (newAttrs.title) {
      note.name = generateNoteName(newAttrs.title);
    };

    await note.save();

    res.json(note);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const toggleNoteState = async (req, res) => {
  const {
    projectName,
    noteName
  } = req.body;

  try {
    const { _id: projectId } = await getProject(projectName, req.user._id);

    const note = await getNote(noteName, projectId);

    note.completed = !note.completed;

    await note.save();

    res.json(note);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const deleteNote = async (req, res) => {
  const {
    projectName,
    noteName
  } = req.body;

  try {
    const { _id: projectId } = await getProject(projectName, req.user._id);

    const deletedNote = await Note.findOneAndDelete({
      project_id: projectId,
      name: noteName
    });

    res.json(deletedNote);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};