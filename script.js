document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  const title = document.createElement('h1');
  title.textContent = 'To-do List';
  header.appendChild(title);

  const main = document.createElement('main');

  const form = document.createElement('form');
  form.id = 'todo-form';

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.placeholder = 'Введите задачу';
  inputText.required = true;

  const inputDate = document.createElement('input');
  inputDate.type = 'date';

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Добавить';

  form.append(inputText, inputDate, addButton);
  main.appendChild(form);

  const tasksSection = document.createElement('section');
  tasksSection.id = 'tasks-section';
  main.appendChild(tasksSection);

  document.body.append(header, main);
});
