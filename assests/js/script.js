const API_URL = "https://68219a92259dad2655afc3d3.mockapi.io/To-Do-List";
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskCount = document.getElementById("taskCount");

let tasks = [];

async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
  } catch (e) {
    console.error("Error loading tasks:", e);
  }
}

async function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, completed: false }),
    });
    const newTask = await res.json();
    tasks.push(newTask);
    taskInput.value = "";
    renderTasks();
  } catch (e) {
    console.error("Error adding task:", e);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    tasks = tasks.filter((t) => t.id !== id);
    renderTasks();
  } catch (e) {
    console.error("Error deleting task:", e);
  }
}

async function updateTask(id, data) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    tasks = tasks.map((t) => (t.id === id ? updated : t));
    renderTasks();
  } catch (e) {
    console.error("Error updating task:", e);
  }
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "list-group-item task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () =>
      updateTask(task.id, { completed: checkbox.checked })
    );
    li.appendChild(checkbox);

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.classList.add("task-done");
    li.appendChild(span);

    const actions = document.createElement("div");
    actions.className = "task-actions d-flex";

    // Edit button without innerHTML
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-secondary ms-2";
    const editIcon = document.createElement("i");
    editIcon.className = "bi bi-pencil";
    editBtn.appendChild(editIcon);
    editBtn.addEventListener("click", async () => {
      const newText = prompt("Edit task:", task.text);
      if (newText && newText.trim())
        await updateTask(task.id, { text: newText.trim() });
    });
    actions.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger ms-2";
    const delIcon = document.createElement("i");
    delIcon.className = "bi bi-trash";
    delBtn.appendChild(delIcon);
    delBtn.addEventListener("click", () => deleteTask(task.id));
    actions.appendChild(delBtn);

    li.appendChild(actions);
    taskList.appendChild(li);
  });
  const remaining = tasks.filter((t) => !t.completed).length;
  taskCount.textContent = `${remaining} task${
    remaining !== 1 ? "s" : ""
  } remaining`;
}

clearAllBtn.addEventListener("click", async () => {
  if (!confirm("Clear all tasks?")) return;
  await Promise.all(
    tasks.map((t) => fetch(`${API_URL}/${t.id}`, { method: "DELETE" }))
  );
  tasks = [];
  renderTasks();
});

addTaskBtn.addEventListener("click", addTask);
document.addEventListener("DOMContentLoaded", loadTasks);
