const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".btn");

/* =========================
   STORAGE
========================= */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "ALL";

/* save tasks */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* =========================
   ADD TASK FUNCTION
========================= */
function addTask() {
  const text = input.value.trim();

  // prevent empty tasks
  if (!text) return;

  // prevent duplicates
  if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  input.value = "";
  input.focus();

  saveTasks();
  renderTasks();
}

/* click add */
addBtn.addEventListener("click", addTask);

/* =========================
   ENTER KEY TO ADD TASK
========================= */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});

/* =========================
   RENDER TASKS
========================= */
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;

  if (currentFilter === "Pending") {
    filtered = tasks.filter(t => !t.completed);
  } else if (currentFilter === "Completed") {
    filtered = tasks.filter(t => t.completed);
  }

  filtered.forEach(task => {

    /* ================= TASK CARD ================= */
    const li = document.createElement("li");
    li.classList.add("task-item", "adding");

    setTimeout(() => li.classList.remove("adding"), 50);

    /* ================= LEFT SIDE ================= */
    const left = document.createElement("div");
    left.classList.add("task-left");

    /* ================= CHECKBOX ================= */
    const checkBtn = document.createElement("button");
    checkBtn.classList.add("icon-btn");

    const checkIcon = document.createElement("img");
    checkIcon.src = task.completed ? "assets/tick.svg" : "assets/box.svg";

    checkBtn.appendChild(checkIcon);

    checkBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    /* ================= TEXT ================= */
    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;
    textSpan.classList.add("task-text");

    textSpan.dataset.original = task.text;
    textSpan.contentEditable = false;

    /* ================= EDIT BUTTON ================= */
    const editBtn = document.createElement("button");
    editBtn.classList.add("icon-btn");

    const editIcon = document.createElement("img");
    editIcon.src = "assets/edit.svg";

    editBtn.appendChild(editIcon);

    editBtn.addEventListener("click", () => {
      textSpan.contentEditable = true;
      textSpan.focus();

      // move cursor to end
      const range = document.createRange();
      range.selectNodeContents(textSpan);
      range.collapse(false);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });

    /* ================= SAVE EDIT ON ENTER ================= */
    textSpan.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        textSpan.blur();
      }
    });

    /* ================= SAVE EDIT ON BLUR ================= */
    textSpan.addEventListener("blur", () => {
      const newText = textSpan.textContent.trim();

      if (newText) {
        task.text = newText;
        saveTasks();
      } else {
        textSpan.textContent = task.text;
      }

      textSpan.contentEditable = false;
      renderTasks();
    }, { once: true });

    /* ================= DELETE BUTTON ================= */
    const delBtn = document.createElement("button");
    delBtn.classList.add("icon-btn");

    const delIcon = document.createElement("img");
    delIcon.src = "assets/dustbin.svg";

    delBtn.appendChild(delIcon);

    delBtn.addEventListener("click", () => {
      li.classList.add("removing");

      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      }, 200);
    });

    /* ================= ASSEMBLE ================= */
    left.appendChild(checkBtn);
    left.appendChild(textSpan);

    const controls = document.createElement("div");
    controls.classList.add("task-controls");

    controls.appendChild(editBtn);
    controls.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(controls);

    taskList.appendChild(li);
  });
}

/* =========================
   FILTER BUTTONS
========================= */
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.textContent;

    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

/* =========================
   INITIAL LOAD
========================= */
renderTasks();