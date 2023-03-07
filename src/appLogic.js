import { Project } from "./Classes";
import { PubSub } from "./PubSub";

export default function initialize() {
  PubSub.subscribe("Add project", addProject);
  PubSub.subscribe("Add task", addTask);
  PubSub.subscribe("Project click", openProject);
  PubSub.subscribe('Project delete', deleteProject);
}

function addProject({ project_name }) {
  Project.addProject(new Project(project_name));
  PubSub.publish('Update project list', Project.allProjects);
}

function openProject(projectName) {
  const project = Project.findProject(projectName);
  project.open();
  PubSub.publish("Open project", project);
}

function deleteProject(projectName) {
  const project = Project.findProject(projectName);
  if(Project.getActiveProject() === project){
    PubSub.publish('Clear project display');
  }
  project.delete();
}

function addTask({ task_name, task_due, priority }) {
  Project.addTask(task_name, task_due, priority);
  PubSub.publish('Open project', Project.getActiveProject());
}