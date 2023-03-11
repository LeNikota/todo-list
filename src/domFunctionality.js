import Element from "./Classes";
import { PubSub } from "./PubSub";
import deleteIcon from './icons/delete.svg';
import addIcon from './icons/add.svg';
import editIcon from './icons/edit.svg';

export default function createDOM() {
  const root = document.querySelector('body');

  root.appendChild(new Element('header').appendChild(new Element('h1').setTextContent('Todo List')).build());
  root.appendChild(new Element('main').appendChild(new Element('div').addAttribute({class: 'project-display'})).build());
  root.appendChild(createSidebar());
  root.appendChild(createProjectModalWindow());
  root.appendChild(createTaskModalWindow());

  PubSub.subscribe('Update DOM', updateDOM)  
}

function createSidebar() {
  return new Element('div').addAttribute({ class: 'sidebar' })
    .appendChild(new Element('div').addAttribute({ class: 'project-list-calendar' })
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Today').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'today')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Week').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'week')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Month').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'month')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Year').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'year')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('All time').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'all time')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Completed').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'completed')}))
    )
    .appendChild(new Element('h2').setTextContent('Projects'))
    .appendChild(new Element('div').addAttribute({ class: 'project-list' }))
    .appendChild(new Element('button').addAttribute({ class: 'add-project', type: 'button' })
      .addEventListener({click: toggleProjectModalWindow})
      .appendChild(new Element('img').addAttribute({src: addIcon}))
      .appendChild(new Element('span').setTextContent('Create Project'))
    ).build();
}

let isEditing = false;
let elementNameIsEditing = '';

function createProjectModalWindow() {
  return new Element('div').addAttribute({ class: 'overlay', id: 'project-modal-window' })
  .addEventListener({click: toggleProjectModalWindow})
  .appendChild(new Element('form').addAttribute({ class: 'modal-window'})
    .addEventListener({submit: onProjectAddition})
    .appendChild(new Element('h2').setTextContent('Create project'))
    .appendChild(new Element('label').addAttribute({ class: 'form-group'})
      .appendChild(new Element('span').setTextContent('Name: '))
      .appendChild(new Element('input').addAttribute({name: 'project_name', required: ''}))
    )
    .appendChild(new Element('button').setTextContent('Create'))
  ).build();
}

function createTaskModalWindow() {
  return new Element('div').addAttribute({ class: 'overlay', id: 'task-modal-window' })
  .addEventListener({click: toggleTaskModalWindow})
  .appendChild(new Element('form').addAttribute({ class: 'modal-window'})
    .addEventListener({submit: onTaskAddition})
    .appendChild(new Element('h2').setTextContent('Add task'))
    .appendChild(new Element('label').addAttribute({ class: 'form-group'})
      .appendChild(new Element('span').setTextContent('Name: '))
      .appendChild(new Element('input').addAttribute({name: 'task_name', required: ''}))
    )
    .appendChild(new Element('label').addAttribute({ class: 'form-group'})
      .appendChild(new Element('span').setTextContent('Due date: '))
      .appendChild(new Element('input').addAttribute({type: 'date', name: 'task_due', required: ''}))
    )
    .appendChild(new Element('label').addAttribute({ class: 'form-group'})
      .appendChild(new Element('span').setTextContent('Priority: '))
      .appendChild(new Element('fieldset')
        .appendChild(new Element('input').addAttribute({class: 'priority', type: 'radio', name: 'priority', value: 'low', required: '', checked: ''}))
        .appendChild(new Element('input').addAttribute({class: 'priority', type: 'radio', name: 'priority', value: 'medium', required: ''}))
        .appendChild(new Element('input').addAttribute({class: 'priority', type: 'radio', name: 'priority', value: 'high', required: ''}))
      )
    )
    .appendChild(new Element('button').setTextContent('Add'))
  ).build();
}


function toggleProjectModalWindow(e) {
  const overlay = document.querySelector('#project-modal-window');

  if(e == null){
    overlay.classList.toggle('opened');
    return;
  }

  const formElement = e.target.closest('.modal-window');
  if(e.target.type === 'submit'){
    if(formElement.reportValidity()){
      overlay.classList.toggle('opened');
    }
  }
  if(formElement == null){
    overlay.classList.toggle('opened');
    isEditing = false;
  }
}

function toggleTaskModalWindow(e) {
  const overlay = document.querySelector('#task-modal-window');

  if(e == null){
    overlay.classList.toggle('opened');
    return;
  }

  const formElement = e.target.closest('.modal-window');
  if(e.target.type === 'submit'){
    if(formElement.reportValidity()){
      overlay.classList.toggle('opened');
    }
  }
  if(formElement == null){
    overlay.classList.toggle('opened')
    isEditing = false;
  }
}

function onProjectAddition(e) {
  e.preventDefault();
  const projectData = Object.fromEntries(new FormData(e.target).entries());
  if(isEditing){
    PubSub.publish('Project edit', [elementNameIsEditing, projectData]);
    isEditing = false;
    elementNameIsEditing = '';
  }else{
    PubSub.publish('Project add', projectData);
  }
  this.reset();
}

function onTaskAddition(e) {
  e.preventDefault();
  const taskData = Object.fromEntries(new FormData(e.target).entries());
  if(isEditing){
    PubSub.publish('Task edit', [elementNameIsEditing, taskData]);
    isEditing = false;
    elementNameIsEditing = '';
  }else{
    PubSub.publish('Task add', taskData);
  }
  this.reset();
}

function updateDOM({allProjects, taskContainer}) {
  function clearDOM() {
    const taskDisplay = document.querySelector('.project-display');
    const projectList = document.querySelector('.project-list');
    taskDisplay.innerHTML = '';
    projectList.innerHTML = '';
  }
  function updateProjectsListDisplay(projectArray){
    if(projectArray == null) return;

    const projectList = document.querySelector('.project-list');
    projectArray.map(project => {
      return new Element('button').addAttribute({ class: 'project', type: 'button' })
        .addEventListener({click: handleProjectClick})
        .appendChild(new Element('span').setTextContent(project.getName()))
        .appendChild(new Element('img').addAttribute({class: 'edit', src: editIcon}))
        .appendChild(new Element('img').addAttribute({class: 'delete', src: deleteIcon}))
        .build()
    }).forEach(project => {
      projectList.appendChild(project)
    })
  }
  function updateTasksDisplay(taskContainer) {
    if(taskContainer == null) return;

    const projectDisplay = document.querySelector('.project-display');
    projectDisplay.appendChild(new Element('h2').setTextContent(taskContainer.getName()).build());
    taskContainer.tasks.map(task => {
      const taskAttributes = (task.complete) ? {class: 'complete', type: 'checkbox', checked:''} : {class: 'complete', type: 'checkbox'};
      return new Element('button').addAttribute({class: 'task'})
        .appendChild(new Element('input').addAttribute(taskAttributes))
        .appendChild(new Element('p').setTextContent(task.name).addAttribute({class: 'task-description'}))
        .appendChild(new Element('p').setTextContent(task.priority).addAttribute({class: `priority ${task.priority}`}))
        .appendChild(new Element('input').addAttribute({class: 'task-date', type: 'date', disabled: '', value: task.dueDate}))
        .appendChild(new Element('img').addAttribute({class: 'edit', src: editIcon}))
        .appendChild(new Element('img').addAttribute({class: 'delete', src: deleteIcon}))
        .addEventListener({click: handleTaskClick})
        .build()
    }).forEach(element => {
      projectDisplay.appendChild(element);
    });

    if(taskContainer.canAddProjects !== false){
      projectDisplay.appendChild(new Element('button').addAttribute({class: 'add-task', type: 'button'})
        .appendChild(new Element('img').addAttribute({src: addIcon}))
        .appendChild(new Element('span').setTextContent('Add Task'))
        .addEventListener({click: toggleTaskModalWindow})
        .build()
      )
    }
  }

  clearDOM();
  updateProjectsListDisplay(allProjects);
  updateTasksDisplay(taskContainer);
}

function handleProjectClick(e) {
  const projectName = this.children[0].textContent;
  switch (e.target.className) {
    case 'edit':
      isEditing = true;
      elementNameIsEditing = projectName;
      toggleProjectModalWindow();
      break;
    case 'delete':
      PubSub.publish('Project delete', projectName);
      break;
    default:
      PubSub.publish('Project click', projectName);
  }
}

function handleTaskClick(e) {
  const taskName = this.children[1].textContent;
  switch (e.target.className) {
    case 'complete':
      PubSub.publish('Task complete', taskName);
      break;
    case 'edit':
      isEditing = true;
      elementNameIsEditing = taskName;
      toggleTaskModalWindow();
      break;
    case 'delete':
      PubSub.publish('Task delete', taskName);
      break;
  }
}