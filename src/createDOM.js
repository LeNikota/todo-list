import Element from "./classes";
import closeIcon from './icons/close_icon.svg';
import addIcon from './icons/add_icon.svg';
import incompleteIcon from './icons/task_incomplete.svg';

export default function createDOM() {
  const root = document.querySelector('body');

  root.appendChild(new Element('header').appendChild(new Element('h1').setTextContent('Todo List')).build());
  root.appendChild(createMain());
  root.appendChild(createSidebar());
}

function createMain() {
  return new Element('main').appendChild(new Element('div').addAttribute({class: 'project-display'})
    .appendChild(new Element('h2').setTextContent('Today'))
    .appendChild(new Element('button').addAttribute({class: 'task'})
      .appendChild(new Element('img').addAttribute({class: 'task-state', src: incompleteIcon}))
      .appendChild(new Element('p').setTextContent('Go to the odin project and programme').addAttribute({class: 'task-description'}))
      .appendChild(new Element('input').addAttribute({class: 'task-date', type: 'date'}))
    )
    .appendChild(new Element('button').addAttribute({class: 'add-task'})
      .appendChild(new Element('img').addAttribute({src: addIcon}))
      .appendChild(new Element('span').setTextContent('Add Task'))
    )
  ).build();
}

function createSidebar() {
  return new Element('div').addAttribute({ class: 'sidebar' })
    .appendChild(new Element('div').addAttribute({ class: 'project-list-calendar' })
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Today'))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Week'))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Month'))
        .appendChild(new Element('button').addAttribute({ type: 'button' }).setTextContent('Year'))
    )
    .appendChild(new Element('h2').setTextContent('Projects'))
    .appendChild(new Element('div').addAttribute({ class: 'project-list' })
        .appendChild(new Element('button').addAttribute({ class: 'project', type: 'button' })
          .appendChild(new Element('span').setTextContent('Become a programmer'))
          .appendChild(new Element('img').addAttribute({src: closeIcon}))
        )
    ).appendChild(new Element('button').addAttribute({ class: 'add-project', type: 'button' })
      .appendChild(new Element('img').addAttribute({src: addIcon}))
      .appendChild(new Element('span').setTextContent('Add Project'))
    ).build();
}