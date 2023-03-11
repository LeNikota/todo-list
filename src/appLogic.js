import { isThisMonth, isThisWeek, isThisYear, isToday, parseISO } from "date-fns";
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

  PubSub.subscribe('Calender button click', displayTasksByDate)
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

function displayTasksByDate(timeFrame) {
  if(Project.getActiveProject()) Project.getActiveProject().close();

  const allTasks = Project.getAllProjects().reduce((accumulator, project) => accumulator.concat(project.tasks), []);
  let tasksWithinTimeFrame;
  switch (timeFrame) {
    case 'today':
      tasksWithinTimeFrame = allTasks.filter( task => isToday(parseISO(task.getDueDate())))
      break;
    case 'week':
      tasksWithinTimeFrame = allTasks.filter( task => isThisWeek(parseISO(task.getDueDate())))
      break;
    case 'month':
      tasksWithinTimeFrame = allTasks.filter( task => isThisMonth(parseISO(task.getDueDate())))
      break;
    case 'year':
      tasksWithinTimeFrame = allTasks.filter( task => isThisYear(parseISO(task.getDueDate())))
      break;
    case 'all time':
      tasksWithinTimeFrame = allTasks;
      break;
    case 'completed':
      tasksWithinTimeFrame = allTasks.filter( task => task.complete)
      break;
  }
  PubSub.publish("Update DOM", {
    allProjects: Project.getAllProjects(),
    taskContainer: {
      name: timeFrame,
      tasks: tasksWithinTimeFrame,
      canAddProjects: false,
      getName: () => timeFrame.replace(/^\w/, c => c.toUpperCase())
    }
  });
}

/*



// check is the dates and tasks that those functions return are actually whiting this time range, compare with others on the odin project
// when displaying tasks in the calender disallow to edit, complete, delete
// make dom element indicate opened project inside of the list of projects





*/