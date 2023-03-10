export default class Element {
  constructor(elementType) {
    this.elementType = elementType;
    this.attributes = {};
    this.children = [];
    this.eventListener = {};
  }

  addAttribute(attributes){
    for (const key in attributes){
      this.attributes[key] = attributes[key];
    }
    
    return this;
  }

  appendChild(childElement){
    this.textContent  = undefined;
    this.children.push(childElement);

    return this;
  }

  setTextContent (text){
    this.children = [];
    this.textContent  = text;

    return this;
  }

  addEventListener(eventListener){
    for (const event in eventListener){
      this.eventListener[event] = eventListener[event];
    }
    
    return this;
  }

  build(){
    let DOMelement = document.createElement(this.elementType);

    for (const key in this.attributes) {
      DOMelement.setAttribute(key, this.attributes[key])
    }

    for (const event in this.eventListener){
      DOMelement.addEventListener(event, this.eventListener[event]);
    }

    if (this.textContent){
      let DOMtextContent = document.createTextNode(this.textContent);
      DOMelement.appendChild(DOMtextContent)
    } else {
      this.children.forEach(child => {
        DOMelement.appendChild(child.build())
      })
    }
    
    return DOMelement;
  }
}

export class Task {
  constructor(name, dueDate, priority){
    this.name = name;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = false;
  }

  setName(name){
    this.name = name;
  }

  setDueDate(dueDate){
    this.dueDate = dueDate;
  }

  setPriority(priority){
    this.priority = priority;
  }

  toggleCompletion(){
    this.complete = !this.complete;
  }
}

export class Project {
  constructor(name){
    this.name = name;
    this.tasks = [];
    this.active = false;
  }

  static allProjects = [];

  static activeProject = null;

  static getAllProjects(){
    return Project.allProjects;
  }

  static setAllProjects(allProjects){
    allProjects.forEach( project => {
      Object.setPrototypeOf( project, Project.prototype)
      project.tasks.forEach( task => {
        Object.setPrototypeOf(task, Task.prototype)
      })
    })
    
    Project.allProjects = allProjects;
    Project.activeProject = Project.allProjects.find((project) => project.active)
  }

  static findProject(projectName) {
    return Project.allProjects.find((project) => project.name === projectName);
  }

  static addProject(project){
    Project.allProjects.push(project);
  }

  static addTaskToActiveProject(task){
    Project.activeProject.tasks.push(task)
  }

  static getActiveProject(){
    return Project.activeProject;
  }

  addTask(task){
    this.tasks.push(task)
  }

  findTask(name) {
    return this.tasks.find((task) => task.name === name);
  }

  deleteTask(name) {
    this.tasks = this.tasks.filter((task) => task.name !== name);
  }

  getName(){
    return this.name;
  }

  setName(name){
    this.name = name;
  }
  
  getTasks(){
    return this.tasks;
  }

  open(){
    if(Project.activeProject){
      Project.activeProject.close();
    }
    this.active = true;
    Project.activeProject = this;
  }

  close(){
    this.active = false;
    Project.activeProject = null;
  }

  delete(){
    if(this.active === true){
      Project.activeProject = null;
    }
    Project.allProjects = Project.allProjects.filter((project) => project !== this);
  }
}

export class Warning {
  constructor(text, timeout) {
    const warningBox = document.createElement('div');
    warningBox.textContent = text;
    warningBox.classList.add('warning');
    document.body.appendChild(warningBox);
    setTimeout(() => {
      warningBox.remove();
    }, timeout || 3000);
  }
}