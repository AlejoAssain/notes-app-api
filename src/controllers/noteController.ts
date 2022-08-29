import { Request, Response } from "express";
import { getRequestUser } from "../middleware/authMiddleware.js";
import { Note, INote } from "../models/note.model.js";
import { getProject, isParticipant } from "./projectController.js";
import { getIdByUsername, getUsernameById } from "./userController.js";


const filterNoteData = async (note: INote) => {
  const {
    name,
    title,
    content,
    priority,
    completed,
    assigned_user_id: assignedUserId
  } = note;

  let assignedUname : string | null = null;

  if (assignedUserId) {
    assignedUname = await getUsernameById(assignedUserId);
  };

  return {
    name: name,
    title: title,
    content: content,
    priority: priority,
    completed: completed,
    assignedUsername: assignedUname
  };
};

export const deleteAllNotesOfProject = async (projectId: string) => {
  await Note.deleteMany({ project_id: projectId });
};

const deleteSpaces = (word : string) => word.split(" ").join("");

const generateNoteName = (noteTitle : string) => deleteSpaces(noteTitle).toLowerCase();

export const getNote = async (noteName: string, projectId: string) => {
  const note = await Note.findOne( { name: noteName, project_id: projectId } );

  if (!note) throw new Error("Note doesn't exist")

  return note;
};

export const getNotesOfProject = async (req: Request, res: Response) => {
  const { ownerUsername, projectName } = req.params;
  let isOwner;

  try {
    let projectId;

    const currentUser = getRequestUser(req);

    if (ownerUsername === currentUser.username) {
      const project = await getProject(projectName, currentUser._id);
      if (project) {
        projectId = project._id;
        isOwner = true;
      } else {
        throw new Error("Project doesn't exist");
      }


    } else {
      const ownerId = await getIdByUsername(ownerUsername);
      const project = await getProject(projectName, ownerId);
      if (project) {
        projectId = project._id;
        isOwner = false;
      } else {
        throw new Error("Project doesn't exist");
      }

    };

    const notes = await Note.find( { project_id: projectId });

    const filteredNotes = await Promise.all(notes.map((note) => filterNoteData(note)));

    const response = {
      isOwner: isOwner,
      notes: filteredNotes
    };

    res.json(response);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const createNote = async (req: Request, res: Response) => {
  const {
    projectName,
    title: noteTitle,
    content: noteContent,
    priority: notePriority,
  } = req.body;

  try {
    const currentUser = getRequestUser(req);

    const project = await getProject(projectName, currentUser._id);

    if (project) {
      const projectId = project._id

      const newNoteName = generateNoteName(noteTitle);
      if (await Note.findOne({ project_id: projectId, name: newNoteName})) {
        throw new Error("Note already exists");
      } else {
        const newNote = new Note({
          name: newNoteName,
          title: noteTitle,
          content: noteContent,
          priority: Number(notePriority),
          project_id: projectId,
          completed: false,
          assigned_user_id: null
        });

        await newNote.save();

        console.log("Note created");

        res.json(await filterNoteData(newNote));

      };
    }

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(400).json(errorMessage);
  };
};

export const assignUser = async (req: Request, res: Response) => {
  const {
    projectName,
    usernameToAssign,
    noteName
  } = req.body;

  try {
    const currentUser = getRequestUser(req);

    const userIdToAssign = await getIdByUsername(usernameToAssign);

    const project = await getProject(projectName, currentUser._id);

    if (!project) {
      throw new Error("Project doesn't exist")
    }

    if ( project.participants_id.includes(userIdToAssign) ) {
      const note = await getNote(noteName, project._id);

      if (!note) {
        throw new Error("Note doesn't exist")
      }

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
    res.status(400).json(errorMessage);
  };
};

export const updateNote = async (req: Request, res: Response) => {
  const {
    noteName,
    projectName,
    ...newAttrs
  } = req.body;

  try {
    const currentUser = getRequestUser(req);

    const project = await getProject(projectName, currentUser._id);

    if (!project) throw new Error("Project doesn't exist")

    const projectId = project._id

    const note = await getNote(noteName, projectId);

    if (!note) throw new Error("Note not found!")

    Object.assign(note, newAttrs);

    if (newAttrs.title) {
      note.name = generateNoteName(newAttrs.title);
    };

    await note.save();

    res.json(await filterNoteData(note));

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const toggleNoteState = async (req: Request, res: Response) => {
  const {
    ownerUsername,
    projectName,
    noteName
  } = req.body;
  let projectId;
  let isOwner;

  try {
    const currentUser = getRequestUser(req);

    if (ownerUsername === currentUser.username) {
      const project = await getProject(projectName, currentUser._id);

      if (!project) throw new Error("Project doesn't exist");

      projectId = project._id;
      isOwner = true;
    } else {
      const ownerId = await getIdByUsername(ownerUsername);
      const project = await getProject(projectName, ownerId);

      if (!project) throw new Error("Project doesn't exist");

      projectId = project._id;
      isOwner = false;
    };

    if ((!isOwner && await isParticipant(currentUser._id, projectId)) || isOwner) {
      const note = await getNote(noteName, projectId);



      note.completed = !note.completed;

      await note.save();

      res.json(await filterNoteData(note));

    } else {
      throw new Error("You're not a participant or the owner");

    };

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(401).json(errorMessage);
  };
};

export const deleteNote = async (req: Request, res: Response) => {
  const {
    projectName,
    noteName
  } = req.params;

  try {
    const currentUser = getRequestUser(req);

    const { _id: projectId } = await getProject(projectName, currentUser._id);

    const deletedNote = await Note.findOneAndDelete({
      project_id: projectId,
      name: noteName
    });

    if (!deletedNote) throw new Error("Note not found");

    res.json(filterNoteData(deletedNote));

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};
