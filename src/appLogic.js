import { Project, Task, Warning } from "./Classes";
import { PubSub } from "./PubSub";

export default function initialize() {
  retrieveFromLocalStorage()
  PubSub.subscribe("Update DOM", populateLocalStorage);
  
  PubSub.subscribe("Project add", addProject);
  PubSub.subscribe("Project click", openProject);
  PubSub.subscribe('Project edit', editProject);
  PubSub.subscribe('Project delete', deleteProject);
  PubSub.subscribe("Task add", addTask);
  PubSub.subscribe("Task edit", editTask);
  PubSub.subscribe("Task complete", completeTask);
  PubSub.subscribe("Task delete", deleteTask);
}

function populateLocalStorage() {
  localStorage.setItem('projectsArray', JSON.stringify(Project.getAllProjects()));
}

function retrieveFromLocalStorage() {
  Project.setAllProjects(JSON.parse(localStorage.getItem('projectsArray')));
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function hasDuplicates(array, name) {
  if(array.some(element => element.name === name)){
    new Warning('The project/task with the same name already exists')
    return true;
  }
}

function addProject({ project_name }) {
  if(hasDuplicates(Project.getAllProjects(), project_name)) return;

  Project.addProject(new Project(project_name));
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function openProject(projectName) {
  const project = Project.findProject(projectName);
  project.open();
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function editProject([oldName, {project_name}]) {
  if(hasDuplicates(Project.getAllProjects(), project_name)) return;

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
  if(hasDuplicates(Project.getActiveProject().getTasks(), task_name)) return;

  Project.addTaskToActiveProject(new Task(task_name, task_due, priority));
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function editTask([oldName, newTask]) {
  if(hasDuplicates(Project.getActiveProject().getTasks(), newTask.task_name)) return;

  const task = Project.getActiveProject().findTask(oldName);
  task.setName(newTask.task_name);
  task.setDueDate(newTask.task_due);
  task.setPriority(newTask.priority);
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function completeTask(name) {
  const task = Project.getActiveProject().findTask(name);
  task.toggleCompletion()
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}

function deleteTask(name) {
  const project = Project.getActiveProject();
  project.deleteTask(name)
  PubSub.publish("Update DOM", {allProjects: Project.getAllProjects(), taskContainer: Project.getActiveProject()});
}


/*





// save projects to the local storage to the project
// display all tasks within all time, month, week, day, 





*/