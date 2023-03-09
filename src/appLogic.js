import { Project, Task } from "./Classes";
import { PubSub } from "./PubSub";

export default function initialize() {
  PubSub.subscribe("Project add", addProject);
  PubSub.subscribe("Project click", openProject);
  PubSub.subscribe('Project edit', editProject);
  PubSub.subscribe('Project delete', deleteProject);
  PubSub.subscribe("Task add", addTask);
  PubSub.subscribe("Task edit", editTask);
}

function addProject({ project_name }) {
  Project.addProject(new Project(project_name));
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function openProject(projectName) {
  const project = Project.findProject(projectName);
  project.open();
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function editProject([oldName, {project_name}]) {
  const project = Project.findProject(oldName);
  project.setName(project_name);
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function deleteProject(projectName) {
  const project = Project.findProject(projectName);
  project.delete();
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function addTask({ task_name, task_due, priority }) {
  Project.addTaskToActiveProject(new Task(task_name, task_due, priority));
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function editTask([oldName, newTask]) {
  console.log(newTask);
  const task = Project.getActiveProject().findTask(oldName);
  task.setName(newTask.task_name);
  task.setDueDate(newTask.task_due);
  task.setPriority(newTask.priority);

  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}