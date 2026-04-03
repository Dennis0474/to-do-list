let tasks = [];
let currentFilter = 'all';


const taskInput = document.querySelector("#task-input");
const dueDateInput = document.getElementById("task-due-date");
const addTaskBtn = document.querySelector("#add-task-btn");
const taskList = document.querySelector("#task-list");
const filterButtons = document.querySelectorAll(".filters button");
const searchInput= document.getElementById("search-input");
const taskCounter = document.getElementById("task-counter");
const clearCompletedBtn = document.getElementById("clear-completed");
const darkModeBtn = document.getElementById('dark-mode-toggle');

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
const saved = localStorage.getItem("tasks");
if (saved) {
tasks = JSON.parse(saved);
}
}

function loadDarkMode() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
}

function addTask() {
const text = taskInput.value.trim();

if (text === "") return;

const task = {
  id: Date.now(),
  text: text,
  completed: false,
  dueDate: dueDateInput.value
};

tasks.push(task);

saveTasks();
renderTasks();
taskInput.value = "";
dueDateInput.value = "";
}

function editTask(id) {
 const newText = prompt("Edit task:");

 if (!newText) return;

 tasks = tasks.map(task => {
if (task.id === id) {
  return {
   ...task,
   text: newText
  };
}
return task;
 });

 saveTasks();
 renderTasks();
}

function deleteTask(id) {
tasks = tasks.filter(task => task.id !== id);

saveTasks();
renderTasks();
updateTaskCounter();
}

function toggleCompleted(id) {
tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);

saveTasks();
renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();
}

function renderTasks(searchTerm = "") {
taskList.innerHTML = "";

if (tasks.length === 0) {
  taskList.innerHTML = "<p class='empty'>No tasks yet. Add one!</p>";
  return;
}

let filteredTasks = tasks.filter(task => {
if (currentFilter === "active") return !task.completed;

if (currentFilter === "completed") return task.completed;

return true;
});

if (searchTerm) {
filteredTasks = filteredTasks.filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()));
}


filteredTasks.forEach(task => {
const li = document.createElement("li");
li.classList.add("task");

if (task.completed) {
  li.classList.add("completed");
}

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = task.completed;

checkbox.addEventListener('change', () => {
toggleCompleted(task.id);
});

const span = document.createElement("span");
span.textContent = task.text;

if (task.dueDate) {
 const dueSpan = document.createElement("span");
 dueSpan.textContent = ` (Due: ${task.dueDate})`;
 span.appendChild(dueSpan);
}

const editBtn = document.createElement("button");
editBtn.textContent = "Edit";
editBtn.classList.add("edit-btn");

editBtn.addEventListener('click', () => {
editTask(task.id);
});

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
deleteBtn.classList.add("delete-btn");

deleteBtn.addEventListener("click", () => {
deleteTask(task.id);
});

li.append(checkbox, span, editBtn, deleteBtn);

taskList.appendChild(li);
});

updateTaskCounter();
}


function updateTaskCounter() {
  const activeTasks = tasks.filter(task => !task.completed).length;
;
  taskCounter.textContent = `${activeTasks} task(s) left`;
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", e => {
if (e.key === "Enter") {
  addTask();
}
});

searchInput.addEventListener('input', () => renderTasks(searchInput.value));

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

filterButtons.forEach(button => {

button.addEventListener("click", () => {

currentFilter = button.dataset.filter;

renderTasks(searchInput.value);
  });
});

darkModeBtn.addEventListener('click', () => {
document.body.classList.toggle("dark-mode");

localStorage.setItem("darkMode", document.classList.contains("dark-mode"));
});

function init() {
  loadTasks();
  loadDarkMode();
  renderTasks();
}

init();


