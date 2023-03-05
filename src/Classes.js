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
}

export class Project {
  constructor(name){
    this.name = name;
    this.tasks = [];
    this.active = false;
    Project.addProject(this);
  }

  static allProjects = [];

  static getAllProjects(){
    return Project.allProjects;
  }

  static findProject(projectName) {
    return Project.allProjects.find((project) => project.getName() === projectName);
  }

  static addProject(project){
    Project.allProjects.push(project);
  }

  static addTask(name, dueDate, priority){
    const project = Project.getActiveProject();
    project.tasks.push(new Task(name, dueDate, priority))
  }

  static getActiveProject(){
    return Project.allProjects.find((project) => project.active === true);
  }

  appendToDo(task) {
    this.tasks.push(task);
  }

  getName(){
    return this.name;
  }
  
  getTasks(){
    return this.tasks;
  }

  activate(){
    Project.allProjects.forEach((project) => project.active = false)
    this.active = true;
  }

  open(){
    this.activate();
  }
}