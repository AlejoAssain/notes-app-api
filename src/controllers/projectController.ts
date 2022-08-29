import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware.js";
import { Project, IProject } from "../models/project.model.js";
import { deleteAllNotesOfProject } from "./noteController.js";
import { getUsernameById } from "./userController.js"


const filterProjectsData = async (project: IProject, ownerUname: string | undefined) => {
  const {
    name,
    description,
    owner_id: pOwnerId,
  } = project;

  const ownerUsername = ownerUname ? ownerUname : await getUsernameById(pOwnerId);

  const filteredData = {
    name: name,
    description: description,
    ownerUsername: ownerUsername,
  }

  return filteredData;
};

export const getProject = async (projectName: string, ownerId: string) => {
  const project = await Project.findOne( { name: projectName, owner_id: ownerId} );

  if (!project) throw new Error("Project doesn't exist");

  return project;
};

export const isParticipant = async (participantId: string, projectId: string) => {
  const project = await Project.findById(projectId);
  if (project) {
    return project.participants_id.includes(participantId);
  }
  return false;
}

export const getMyProjects = async (req: CustomRequest, res: Response) => {
  const ownedProjects = await Project.find( { owner_id: req.user._id } );
  const participantProjects = await Project.find( { participants_id: req.user._id } );

  const ownedProjectsFiltered = await Promise.all(ownedProjects.map(
    (project) => filterProjectsData(project, req.user.username)
  ));

  const participantProjectsFiltered = await Promise.all(participantProjects.map(
    (project) => filterProjectsData(project, undefined)
  ));

  res.json({
    ownerRole: ownedProjectsFiltered,
    participantRole: participantProjectsFiltered
  });
};

export const createProject = async (req: CustomRequest, res: Response) => {
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

      res.json(await filterProjectsData(newProject, req.user.username));

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

// export const addParticipant = async (req: CustomRequest, res: Response) => {
//   const { participantUsername, projectName } = req.body;

//   try {
//     const { _id: participantId } = await User.findOne({ username: participantUsername });

//     const project = await Project.findOne({ name: projectName, owner_id: req.user._id });

//     project.participants_id.push(participantId);

//     project.save();

//     const message = `Owner ${req.user.username} added participant ${participantUsername}`;

//     console.log(message);
//     res.json(message);

//   } catch (e) {
//     const errorMessage = "Error: " + e;

//     console.log(errorMessage);
//     res.json(errorMessage);
//   };
// };

export const updateProjectData = async (req: CustomRequest, res: Response) => {
  const {
    name: projectName,
    newName,
    newDescription
  } = req.body;

  try {
    const project = await Project.findOne( { owner_id: req.user._id, name: projectName } );

    if (project) {
      if (newName) {
        project.name = newName;
      };

      if (newDescription) {
        project.description = newDescription;
      };

      project.save();

      res.json(await filterProjectsData(project, req.user.username));
    } else {
      throw new Error("Project doesn't exists");
    }

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.status(404).json(errorMessage);
  };
};

export const deleteProject = async (req: CustomRequest, res: Response) => {
  const { projectName } = req.params;

  try {
    const deletedProject = await Project.findOneAndDelete( { owner_id: req.user._id, name: projectName } );

    if (deletedProject) {
      await deleteAllNotesOfProject(deletedProject._id);

      res.json({deletedProject: await filterProjectsData(deletedProject, req.user.username)});
    } else {

    }

  } catch (e) {
    const errorMessage = "Error: " + e;

    console.log(errorMessage);
    res.json(errorMessage);
  };
};