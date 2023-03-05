import { Project } from "./Classes";
import { PubSub } from "./PubSub";

export default function initialize() {
  PubSub.subscribe("Create project", createProject);
  PubSub.subscribe("Add task", addTask);
  PubSub.subscribe("Project click", openProject);
}

function createProject({ project_name }) {
  new Project(project_name);
}

function addTask({ task_name, task_due, priority }) {
  Project.addTask(task_name, task_due, priority);
  PubSub.publish('Open project', Project.getActiveProject());
}

function openProject(projectName) {
  const project = Project.findProject(projectName);
  project.open();
  PubSub.publish("Open project", project);
}
