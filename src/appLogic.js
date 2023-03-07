import { Project } from "./Classes";
import { PubSub } from "./PubSub";

export default function initialize() {
  PubSub.subscribe("Add project", addProject);
  PubSub.subscribe("Project click", openProject);
  PubSub.subscribe('Project edit', editProject);
  PubSub.subscribe('Project delete', deleteProject);
  PubSub.subscribe("Add task", addTask);
}

function addProject({ project_name }) {
  Project.addProject(new Project(project_name));
  PubSub.publish('Update project list', Project.getAllProjects());
}

function openProject(projectName) {
  const project = Project.findProject(projectName);
  project.open();
  PubSub.publish("Open project", project);
}

function editProject([oldName, {project_name}]) {
  const project = Project.findProject(oldName);
  project.setName(project_name);
  PubSub.publish("Update project list", Project.getAllProjects())
  console.log(Project.getAllProjects());
}

function deleteProject(projectName) {
  const project = Project.findProject(projectName);
  if(Project.getActiveProject() === project){ 
    PubSub.publish('Clear project display');
  }
  project.delete();
  PubSub.publish('Update project list', Project.getAllProjects());
}

function addTask({ task_name, task_due, priority }) {
  Project.addTask(task_name, task_due, priority);
  PubSub.publish('Open project', Project.getActiveProject());
}