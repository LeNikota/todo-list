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

  getName(){
    return this.name;
  }
  
  getTasks(){
    return this.tasks;
  }

  setName(name){
    this.name = name;
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

// class ModalWindow {
//   #_
//   #_init(){
//     const root = document.querySelector('body');

//     root.appendChild(new Element('div').addAttribute({ class: 'overlay', id: 'project-modal-window' })
//       .addEventListener({click: toggleProjectModalWindow})
//       .appendChild(new Element('form').addAttribute({ class: 'modal-window'})
//         .addEventListener({submit: onProjectAddition})
//         .appendChild(new Element('h2').setTextContent('Create project'))
//         .appendChild(new Element('label').addAttribute({ class: 'form-group'})
//           .appendChild(new Element('span').setTextContent('Name: '))
//           .appendChild(new Element('input').addAttribute({name: 'project_name', required: ''}))
//         )
//         .appendChild(new Element('button').setTextContent('Create'))
//       ).build()
//     )
//   }

//   open(){

//   }
// }