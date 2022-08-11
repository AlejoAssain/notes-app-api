import { Project } from "../models/project.model.js";
import { deleteAllNotesOfProject } from "./noteController.js";
import { getUsernameById } from "./userController.js"


const filterProjectsData = async (project, ownerUname) => {
  const {
    name,
    description,
    owner_id: pOwnerId,
    createdAt,
    updatedAt
  } = project;

  const ownerUsername = ownerUname ? ownerUname : await getUsernameById(pOwnerId);

  const filteredData = {
    name: name,
    description: description,
    ownerUsername: ownerUsername,
    creationDate: createdAt,
    updateDate: updatedAt
  }

  return filteredData;
};

export const getProject = async (projectName, userId) => {
  const project = await Project.findOne( { name: projectName, owner_id: userId} );
  return project;
};

export const getMyProjects = async (req, res) => {
  const ownedProjects = await Project.find( { owner_id: req.user._id } );
  const participantProjects = await Project.find( { participants_id: req.user._id } );

  const ownedProjectsFiltered = await Promise.all(ownedProjects.map(
    async (project) => await filterProjectsData(project, req.user.username)
  ));

  const participantProjectsFiltered = await Promise.all(participantProjects.map(
    async (project) => await filterProjectsData(project)
  ));

  res.json({
    ownerRole: ownedProjectsFiltered,
    participantRole: participantProjectsFiltered
  });
};

export const createProject = async (req, res) => {
  const {
    name: pName,
    description: pDesc,
  } = req.body;

  const projectsWithName = await Project.find( { name: pName, owner_id: req.user._id } )

  if ( projectsWithName.length === 0 ) {
    const newProject = new Project({
      name: pName,
      description: pDesc,
      owner_id: req.user._id,
      participants_id: []
    });

    try {
      await newProject.save();

      res.json(newProject);

      console.log("Project created");

    } catch (e) {
      const errorMessage = "Error: " + e;

      console.log(errorMessage);
      res.json(errorMessage);

    };
  } else {
    res.json("Project name already exists");

    console.log("Project name exists");
  };
};

export const addParticipant = async (req, res) => {
  const { participantUsername, projectName } = req.body;

  try {
    const { _id: participantId } = await User.findOne( { username: participantUsername });

    const project = await Project.findOne( { name: projectName, owner_id: req.user._id } )

    project.participants_id.push(participantId);

    project.save();

    const message = `Owner ${req.user.username} added participant ${participantUsername}`;

    console.log(message);
    res.json(message);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const updateProjectData = async (req, res) => {
  const {
    name: projectName,
    newName,
    newDescription
  } = req.body;

  try {
    const project = await Project.findOne( { owner_id: req.user._id, name: projectName } );

    if (newName) {
      project.name = newName;
    };

    if (newDescription) {
      project.description = newDescription;
    };

    project.save();

    res.json(project);

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};

export const deleteProject = async (req, res) => {
  const { projectName } = req.params;

  try {
    const deletedProject = await Project.findOneAndDelete( { owner_id: req.user._id, name: projectName } );

    await deleteAllNotesOfProject(deletedProject._id);

    res.json({deletedProject: await filterProjectsData(deletedProject)});

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};
