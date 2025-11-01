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

  const sortButton = document.createElement('button');
  sortButton.textContent = 'Сортировать по дате';
  sortButton.type = 'button';
  main.appendChild(sortButton);

  const tasksSection = document.createElement('section');
  tasksSection.id = 'tasks-section';
  main.appendChild(tasksSection);

  document.body.append(header, main);

  const tasks = [];

  function renderTasks() {
    tasksSection.innerHTML = '';
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

      const taskContent = document.createElement('div');

      if (task.isEditing) {
        const inputTextEdit = document.createElement('input');
        inputTextEdit.type = 'text';
        inputTextEdit.value = task.text;

        const inputDateEdit = document.createElement('input');
        inputDateEdit.type = 'date';
        inputDateEdit.value = task.date;

        taskContent.append(inputTextEdit, inputDateEdit);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Сохранить';
        saveBtn.addEventListener('click', () => {
          const newText = inputTextEdit.value.trim();
          const newDate = inputDateEdit.value;

          if (newText) {
            task.text = newText;
            task.date = newDate;
            task.isEditing = false;
            renderTasks();
          } else {
            alert('Задача не может быть пустой');
          }
        });
        taskContent.appendChild(saveBtn);
      } else {
        const taskText = document.createElement('p');
        taskText.textContent = task.text + (task.date ? ` (до ${task.date})` : '');
        if (task.done) {
          taskText.style.textDecoration = 'line-through';
          taskText.style.color = 'gray';
        }
        taskContent.appendChild(taskText);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Редактировать';
        editBtn.addEventListener('click', () => {
          task.isEditing = true;
          renderTasks();
        });
        taskContent.appendChild(editBtn);
      }

      taskDiv.appendChild(taskContent);

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
      isEditing: false,
    };

    tasks.push(newTask);
    renderTasks();
    form.reset();
  });

  sortButton.addEventListener('click', () => {
    tasks.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date) - new Date(b.date);
    });
    renderTasks();
  });
});
