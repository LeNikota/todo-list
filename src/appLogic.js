import { Project } from "./Classes";
import { PubSub } from "./PubSub";

export default function initialize() {
  PubSub.subscribe("Add project", createProject);
  PubSub.subscribe("Add task", addTask);
  PubSub.subscribe("Project click", openProject);
}

const projects = [];

function createProject({ project_name }) {
  projects.push(new Project(project_name));
}

function addTask(thing){
   
}

function openProject(projectName) {
  const project = projects.find((project) => project.getName() === projectName);
  console.log(Project.getAllProjects());
  PubSub.publish("Open project", project);
}