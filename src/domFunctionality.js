import Element from "./Classes";
import { PubSub } from "./PubSub";
import closeIcon from './icons/close_icon.svg';
import addIcon from './icons/add_icon.svg';
import incompleteIcon from './icons/task_incomplete.svg';

export default function createDOM() {
  const root = document.querySelector('body');

  root.appendChild(new Element('header').appendChild(new Element('h1').setTextContent('Todo List')).build());
  root.appendChild(createMain());
  root.appendChild(createSidebar());
  root.appendChild(createProjectModalWindow());
  root.appendChild(createTaskModalWindow());

  PubSub.subscribe('Open project', openProject)
}

function createMain() {
  return new Element('main').appendChild(new Element('div').addAttribute({class: 'project-display'})
    .appendChild(new Element('h2').setTextContent('Today'))
    .appendChild(new Element('button').addAttribute({class: 'task'})
      .appendChild(new Element('img').addAttribute({class: 'task-state', src: incompleteIcon}))
      .appendChild(new Element('p').setTextContent('Go to the odin project and programme').addAttribute({class: 'task-description'}))
      .appendChild(new Element('input').addAttribute({class: 'task-date', type: 'date'}))
    )
    .appendChild(new Element('button').addAttribute({class: 'add-task', type: 'button'})
      .appendChild(new Element('img').addAttribute({src: addIcon}))
      .appendChild(new Element('span').setTextContent('Add Task'))
      .addEventListener({click: toggleTaskModalWindow})
    )
  ).build();
}

function createSidebar() {
  return new Element('div').addAttribute({ class: 'sidebar' })
    .appendChild(new Element('div').addAttribute({ class: 'project-list-calendar' })
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Today').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'today')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Week').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'week')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Month').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'month')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Year').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'year')}))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('All time').addEventListener({'click': ()=> PubSub.publish('Calender button click', 'all time')}))
    )
    .appendChild(new Element('h2').setTextContent('Projects'))
    .appendChild(new Element('div').addAttribute({ class: 'project-list' }))
    .appendChild(new Element('button').addAttribute({ class: 'add-project', type: 'button' })
      .addEventListener({click: toggleProjectModalWindow})
      .appendChild(new Element('img').addAttribute({src: addIcon}))
      .appendChild(new Element('span').setTextContent('Create Project'))
    ).build();
}

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
        .appendChild(new Element('input').addAttribute({class: 'priority', type: 'radio', name: 'priority', value: 'low', required: ''}))
        .appendChild(new Element('input').addAttribute({class: 'priority', type: 'radio', name: 'priority', value: 'medium', required: ''}))
        .appendChild(new Element('input').addAttribute({class: 'priority', type: 'radio', name: 'priority', value: 'high', required: ''}))
      )
    )
    .appendChild(new Element('button').setTextContent('Add'))
  ).build();
}

function toggleProjectModalWindow(e) {
  const overlay = document.querySelector('#project-modal-window');
  const formElement = e.target.closest('.modal-window');
  if(e.target.type === 'submit'){
    if(formElement.reportValidity()){
      overlay.classList.toggle('opened');
    }
  }
  if(!formElement){
    overlay.classList.toggle('opened')
  }
}

function toggleTaskModalWindow(e) {
  const overlay = document.querySelector('#task-modal-window');
  const formElement = e.target.closest('.modal-window');
  if(e.target.type === 'submit'){
    if(formElement.reportValidity()){
      overlay.classList.toggle('opened');
    }
  }
  if(!formElement){
    overlay.classList.toggle('opened')
  }
}

function onTaskAddition(e) {
  e.preventDefault();
  const taskData = Object.fromEntries(new FormData(e.target).entries());
  PubSub.publish('Add task', taskData);
}

function onProjectAddition(e) {
  e.preventDefault();
  const projectData = Object.fromEntries(new FormData(e.target).entries());
  addProjectElementToList(projectData);
  PubSub.publish('Create project', projectData);
}

function addProjectElementToList({project_name}){
  const projectList = document.querySelector('.project-list');
  projectList.appendChild(new Element('button').addAttribute({ class: 'project', type: 'button' })
        .addEventListener({click: handleProjectClick})
        .appendChild(new Element('span').setTextContent(project_name))
        .appendChild(new Element('img').addAttribute({src: closeIcon}))
        .build()
      )
}

function clearProjectDisplay() {
  const projectDisplay = document.querySelector('.project-display');
  projectDisplay.innerHTML = '';
}

function openProject(project) {
  const projectDisplay = document.querySelector('.project-display');
  projectDisplay.appendChild(new Element('h2').setTextContent(project.getName()).build());
  if(project.task){
    project.tasks.map(task => {
      
    })
  }
  projectDisplay.appendChild(new Element('button').addAttribute({class: 'add-task', type: 'button'})
    .appendChild(new Element('img').addAttribute({src: addIcon}))
    .appendChild(new Element('span').setTextContent('Add Task'))
    .addEventListener({click: toggleTaskModalWindow})
    .build()
  )
}

function handleProjectClick() {
  const projectName = this.children[0].textContent;
  clearProjectDisplay();
  PubSub.publish('Project click', projectName);
}