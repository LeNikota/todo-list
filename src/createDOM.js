import Element from "./classes";
import closeIcon from './icons/close_icon.svg';
import addIcon from './icons/add_icon.svg';

export default function createDOM() {
  const root = document.querySelector('body');
  const header = new Element('header').appendChild(
    new Element('h1').setTextContent('Todo List')
  ).build();

  root.appendChild(header);
  root.appendChild(createMain());
  root.appendChild(createSidebar());
}

function createMain() {
  return new Element('main').build();
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