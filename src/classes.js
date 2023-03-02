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

export class ToDo {
  constructor(title, dueDate, priority){
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = false;
  }
}

export class Project {
  constructor(title){
    this.title = title;
    this.toDos = [];
  }

  appendToDo(toDo) {
    this.toDos.push(toDo);
  }
}

