document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  const title = document.createElement('h1');
  title.textContent = 'ToDo List';
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

  const tasks = [];

function renderTasks() {
  tasksSection.innerHTML = ''; // очистить список
  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      renderTasks();
    });
    taskDiv.appendChild(checkbox);

    const taskText = document.createElement('p');
    taskText.textContent = task.text + (task.date ? ` (до ${task.date})` : '');

    if (task.done) {
      taskText.style.textDecoration = 'line-through';
      taskText.style.color = 'gray';
    }

    taskDiv.appendChild(taskText);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => {
      const index = tasks.findIndex(t => t.id === task.id);
      if (index > -1) {
        tasks.splice(index, 1);
        renderTasks();
      }
    });
    taskDiv.appendChild(deleteBtn);

    tasksSection.appendChild(taskDiv);
  });
}



  form.addEventListener('submit', e => {
    e.preventDefault();

    const text = inputText.value.trim();
    const date = inputDate.value;

    if (!text) return;

    const newTask = {
      id: Date.now(),
      text,
      date,
      done: false,
    };

    tasks.push(newTask);
    renderTasks();

    form.reset();
  });
});