document.addEventListener('DOMContentLoaded', () => {
  const css = `
    :root {
      --max-width: 720px;
      --gap: 12px;
      --accent: #007bff;
      --muted: #666;
      --bg: #f7f7f8;
      --card-bg: #fff;
      --radius: 10px;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      font-family: Inter, Arial, Helvetica, sans-serif;
      max-width: var(--max-width);
      margin: 20px auto;
      padding: 12px;
      background: var(--bg);
      color: #111;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    header { margin-bottom: 8px; }
    header h1 {
      text-align: center;
      margin: 6px 0 10px;
      font-size: 1.6rem;
      font-weight: 600;
    }

    main { display: flex; flex-direction: column; gap: 14px; }

    form#todo-form {
      display: flex;
      gap: var(--gap);
      align-items: flex-end;
      background: var(--card-bg);
      padding: 12px;
      border-radius: var(--radius);
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }
    .col { display:flex; flex-direction:column; gap:6px; flex:1; min-width:0; }
    label { font-size: 13px; color: var(--muted); }
    input[type="text"], input[type="date"], select {
      padding: 10px;
      font-size: 15px;
      border: 1.5px solid #d0d0d3;
      border-radius: 8px;
      background: #fff;
      transition: border-color .18s, box-shadow .18s;
      width: 100%;
      min-width: 0;
    }
    input[type="text"]:focus, input[type="date"]:focus, select:focus {
      border-color: var(--accent);
      outline: none;
      box-shadow: 0 4px 12px rgba(0,123,255,0.08);
    }
    .actions { display:flex; gap:10px; align-items:center; justify-content:flex-end; }

    button {
      padding: 10px 14px;
      font-size: 14px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      background: var(--accent);
      color: #fff;
      transition: transform .06s ease, background .12s ease;
    }
    button:active { transform: translateY(1px); }
    .btn-secondary {
      background: #f1f1f1;
      color: #222;
      border: 1px solid #e0e0e0;
    }

    #controls {
      display:flex;
      gap:12px;
      align-items:center;
      flex-wrap:wrap;
      justify-content:space-between;
    }
    #controls .group { display:flex; gap:8px; align-items:center; }
    #filter-container { display:flex; gap:8px; align-items:center; }
    #filter-count { color: var(--muted); font-size: 13px; margin-left: 6px; }

    #tasks-section {
      display:flex;
      flex-direction:column;
      gap:10px;
      min-height: 80px;
      margin-bottom: 6px;
    }
    .task {
      display:flex;
      gap:12px;
      align-items:center;
      padding:10px;
      border-radius: 10px;
      background: var(--card-bg);
      border: 1px solid rgba(0,0,0,0.04);
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      transition: box-shadow .12s, transform .08s;
    }
    .task:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
    .task .content { flex:1; display:flex; gap:12px; align-items:center; min-width:0; }
    .task p { margin:0; word-break:break-word; font-size:15px; }
    .task .meta { font-size:12px; color:var(--muted); margin-left:auto; white-space:nowrap; }
    .task.done p { text-decoration: line-through; color: gray; opacity:0.8; }
    .task.dragging { opacity:0.35; transform: scale(.995); }
    .task.drag-over { outline: 2px dashed var(--accent); background: #f0f8ff; }

    .empty { text-align:center; color:var(--muted); padding:16px; background:transparent; }

    footer#footer {
      text-align:center;
      color:var(--muted);
      font-size:13px;
      padding: 12px 6px;
      margin-top: 6px;
      border-top: 1px solid rgba(0,0,0,0.03);
    }

    #toast {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 18px;
      background: rgba(0,0,0,0.82);
      color: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      opacity: 0;
      transition: opacity .18s ease;
      pointer-events: none;
      z-index: 9999;
    }

    @media (max-width: 720px) {
      body { padding: 10px; }
    }
    @media (max-width: 560px) {
      form#todo-form {
        flex-direction: column;
        align-items: stretch;
      }
      .actions { justify-content: stretch; }
      #controls { flex-direction: column; align-items: stretch; gap:10px; }
      #controls .group { width: 100%; justify-content: space-between; }
      #tasks-section { gap: 12px; }
      .task .meta { display:none; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

(function injectFavicon() {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = 'favicon.png';
  document.head.appendChild(link);
})();

  const toastEl = document.createElement('div');
  toastEl.id = 'toast';
  document.body.appendChild(toastEl);
  function showToast(msg, ms = 1500) {
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    setTimeout(() => { toastEl.style.opacity = '0'; }, ms);
  }

  const header = document.createElement('header');
  const title = document.createElement('h1');
  title.textContent = 'ToDo List';
  header.appendChild(title);

  const main = document.createElement('main');
  const form = document.createElement('form');
  form.id = 'todo-form';
  form.setAttribute('aria-label', 'Добавить задачу');

  const colText = document.createElement('div');
  colText.className = 'col';
  const labelText = document.createElement('label');
  labelText.textContent = 'Задача';
  labelText.htmlFor = 'task-text';
  const inputText = document.createElement('input');
  inputText.id = 'task-text';
  inputText.type = 'text';
  inputText.placeholder = 'Введите задачу';
  inputText.required = true;
  colText.append(labelText, inputText);

  const colDate = document.createElement('div');
  colDate.className = 'col';
  const labelDate = document.createElement('label');
  labelDate.textContent = 'Срок (необязательно)';
  labelDate.htmlFor = 'task-date';
  const inputDate = document.createElement('input');
  inputDate.id = 'task-date';
  inputDate.type = 'date';
  colDate.append(labelDate, inputDate);

  const actions = document.createElement('div');
  actions.className = 'actions';
  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Добавить';
  actions.appendChild(addButton);

  form.append(colText, colDate, actions);
  main.appendChild(form);

  const controls = document.createElement('div');
  controls.id = 'controls';

  const leftGroup = document.createElement('div');
  leftGroup.className = 'group';

  const filterContainer = document.createElement('div');
  filterContainer.id = 'filter-container';
  const filterLabel = document.createElement('label');
  filterLabel.textContent = 'Фильтр:';
  filterLabel.htmlFor = 'filter-select';
  const filterSelect = document.createElement('select');
  filterSelect.id = 'filter-select';
  const optionAll = new Option('Все', 'all');
  const optionDone = new Option('Выполненные', 'done');
  const optionNotDone = new Option('Невыполненные', 'not_done');
  filterSelect.add(optionAll);
  filterSelect.add(optionDone);
  filterSelect.add(optionNotDone);
  const filterCount = document.createElement('span');
  filterCount.id = 'filter-count';
  filterCount.textContent = '(0)';
  filterContainer.append(filterLabel, filterSelect, filterCount);

  leftGroup.appendChild(filterContainer);

  const rightGroup = document.createElement('div');
  rightGroup.className = 'group';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Поиск задач...';
  searchInput.setAttribute('aria-label', 'Поиск задач');
  searchInput.style.minWidth = '180px';

  const sortButton = document.createElement('button');
  sortButton.type = 'button';
  sortButton.textContent = 'Сортировать по дате ↑';
  sortButton.className = 'btn-secondary';
  sortButton.dataset.order = 'asc';

  rightGroup.append(searchInput, sortButton);

  controls.append(leftGroup, rightGroup);
  main.appendChild(controls);

  const tasksSection = document.createElement('section');
  tasksSection.id = 'tasks-section';
  tasksSection.setAttribute('role', 'list');
  main.appendChild(tasksSection);

  const footer = document.createElement('footer');
  footer.id = 'footer';
  footer.textContent = 'by Luzhetskaia Mariia';
  document.body.append(header, main, footer);

  const STORAGE_KEY = 'todo_tasks_v1';
  const tasks = [];
  let currentFilter = 'all';
  let currentSearch = '';
  let draggingId = null;

  function validateTaskObject(obj) {
    return obj && (typeof obj.id === 'string' || typeof obj.id === 'number') && typeof obj.text === 'string';
  }

  function safeParseLocal(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Ошибка парсинга localStorage ключа', key, e);
      return null;
    }
  }

  function loadTasks() {
    const raw = safeParseLocal(STORAGE_KEY);
    if (!raw) return;
    if (!Array.isArray(raw)) {
      console.warn('Ожидался массив задач в localStorage, получили:', raw);
      return;
    }
    tasks.length = 0;
    raw.forEach((t, i) => {
      if (validateTaskObject(t)) {
        tasks.push({
          id: String(t.id),
          text: String(t.text),
          date: t.date ? String(t.date) : '',
          done: !!t.done,
          isEditing: !!t.isEditing
        });
      } else {
        console.warn('Пропускаю некорректный элемент localStorage на позиции', i, t);
      }
    });
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Не удалось сохранить задачи:', e);
      showToast('Ошибка сохранения');
    }
  }

  function makeId() {
    return String(Date.now()) + '-' + Math.floor(Math.random() * 1e6);
  }

  function clearChildren(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function getVisibleTasks() {
    let visible = tasks.slice();
    if (currentFilter === 'done') visible = visible.filter(t => t.done);
    else if (currentFilter === 'not_done') visible = visible.filter(t => !t.done);
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      visible = visible.filter(t => t.text.toLowerCase().includes(q));
    }
    return visible;
  }

  function updateFilterCount(count) {
    filterCount.textContent = `(${count})`;
  }

  function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task' + (task.done ? ' done' : '');
    taskDiv.dataset.id = String(task.id);
    taskDiv.setAttribute('role', 'listitem');
    taskDiv.setAttribute('tabindex', '0');
    taskDiv.setAttribute('draggable', 'true');

    taskDiv.addEventListener('dragstart', e => {
      draggingId = String(task.id);
      try { e.dataTransfer.setData('text/plain', draggingId); } catch {}
      taskDiv.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    taskDiv.addEventListener('dragend', () => {
      draggingId = null;
      taskDiv.classList.remove('dragging');
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });
    taskDiv.addEventListener('dragover', e => e.preventDefault());
    taskDiv.addEventListener('dragenter', e => {
      e.preventDefault();
      const dragId = String(draggingId || (e.dataTransfer && e.dataTransfer.getData('text/plain')));
      if (dragId && dragId !== String(task.id)) taskDiv.classList.add('drag-over');
    });
    taskDiv.addEventListener('dragleave', () => taskDiv.classList.remove('drag-over'));
    taskDiv.addEventListener('drop', e => {
      e.preventDefault();
      taskDiv.classList.remove('drag-over');
      const dragged = e.dataTransfer.getData('text/plain') || draggingId;
      const targetId = taskDiv.dataset.id;
      if (!dragged || !targetId || dragged === targetId) return;
      const fromIndex = tasks.findIndex(t => String(t.id) === String(dragged));
      let toIndex = tasks.findIndex(t => String(t.id) === String(targetId));
      if (fromIndex === -1 || toIndex === -1) return;
      const [moved] = tasks.splice(fromIndex, 1);
      if (fromIndex < toIndex) toIndex = toIndex - 1;
      tasks.splice(toIndex, 0, moved);
      saveTasks();
      renderTasks();
    });

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.done;
    checkbox.setAttribute('aria-label', 'Отметить как выполненное');
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });
    taskDiv.appendChild(checkbox);

    const content = document.createElement('div');
    content.className = 'content';

    if (task.isEditing) {
      const inputEditText = document.createElement('input');
      inputEditText.type = 'text';
      inputEditText.value = task.text;
      inputEditText.style.minWidth = '120px';

      const inputEditDate = document.createElement('input');
      inputEditDate.type = 'date';
      inputEditDate.value = task.date || '';

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.textContent = 'Сохранить';
      saveBtn.addEventListener('click', () => {
        const nt = inputEditText.value.trim();
        const nd = inputEditDate.value;
        if (!nt) {
          showToast('Задача не может быть пустой');
          inputEditText.focus();
          return;
        }
        task.text = nt;
        task.date = nd || '';
        task.isEditing = false;
        saveTasks();
        renderTasks();
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Отмена';
      cancelBtn.className = 'btn-secondary';
      cancelBtn.addEventListener('click', () => {
        task.isEditing = false;
        renderTasks();
      });

      content.append(inputEditText, inputEditDate, saveBtn, cancelBtn);
    } else {
      const txt = document.createElement('p');
      const dateText = task.date ? ` (до ${task.date})` : '';
      txt.textContent = task.text + dateText;
      const meta = document.createElement('span');
      meta.className = 'meta';
      meta.textContent = task.date ? `Срок: ${task.date}` : '';
      content.append(txt, meta);

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Редактировать';
      editBtn.className = 'btn-secondary';
      editBtn.addEventListener('click', () => {
        task.isEditing = true;
        renderTasks();
      });
      content.appendChild(editBtn);
    }

    taskDiv.appendChild(content);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.className = 'btn-secondary';
    deleteBtn.addEventListener('click', () => {
      const index = tasks.findIndex(t => t.id === task.id);
      if (index > -1) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        showToast('Задача удалена');
      }
    });
    taskDiv.appendChild(deleteBtn);

    return taskDiv;
  }

  function renderTasks() {
    clearChildren(tasksSection);
    const visible = getVisibleTasks();
    updateFilterCount(visible.length);

    if (visible.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Задач нет';
      tasksSection.appendChild(empty);
      return;
    }

    visible.forEach(task => {
      const el = createTaskElement(task);
      tasksSection.appendChild(el);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = inputText.value.trim();
    const date = inputDate.value || '';
    if (!text) {
      inputText.focus();
      showToast('Введите текст задачи');
      return;
    }
    tasks.push({
      id: makeId(),
      text,
      date,
      done: false,
      isEditing: false
    });
    form.reset();
    saveTasks();
    renderTasks();
    inputText.focus();
    showToast('Задача добавлена');
  });

  filterSelect.addEventListener('change', () => {
    currentFilter = filterSelect.value;
    renderTasks();
  });

  searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value.trim();
    renderTasks();
  });

  sortButton.addEventListener('click', () => {
    const order = sortButton.dataset.order === 'asc' ? 'desc' : 'asc';
    sortButton.dataset.order = order;
    sortButton.textContent = `Сортировать по дате ${order === 'asc' ? '↑' : '↓'}`;
    tasks.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      const da = new Date(a.date);
      const db = new Date(b.date);
      return order === 'asc' ? da - db : db - da;
    });
    saveTasks();
    renderTasks();
  });

  loadTasks();
  renderTasks();

  window.TodoApp = {
    _tasksRef: tasks,
    save: saveTasks,
    load: () => { loadTasks(); renderTasks(); }
  };
});
