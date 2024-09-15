// Get elements
const loginPage = document.getElementById('login-page');
const taskPage = document.getElementById('task-page');
const profileHeader = document.getElementById('profile-header');
const profileSelect = document.getElementById('profile-select');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

const taskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const progress = document.getElementById('progress');
const progressPercent = document.getElementById('progress-percent');

// To store current profile
let currentProfile = null;
let tasks = { Raman: [], Pikachu: [] }; // Task lists for each profile

// Load tasks from localStorage when the page loads
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (savedTasks) {
    tasks = savedTasks;
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a task to the current profile
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    tasks[currentProfile].push({ task: taskText, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = ''; // Clear the input field
  }
}

// Complete a task
function completeTask(index) {
  tasks[currentProfile][index].completed = true;
  saveTasks();
  renderTasks();
}

// Undo a task
function undoTask(index) {
  tasks[currentProfile][index].completed = false;
  saveTasks();
  renderTasks();
}

// Delete a task from the current profile
function deleteTask(index) {
  tasks[currentProfile].splice(index, 1);
  saveTasks();
  renderTasks();
}

// Calculate and update progress
function updateProgress() {
  const totalTasks = tasks[currentProfile].length;
  const completedTasks = tasks[currentProfile].filter(task => task.completed).length;
  const progressPercentValue = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  progress.style.width = `${progressPercentValue}%`;
  progressPercent.textContent = `${progressPercentValue}%`;
}

// Render tasks for the current profile
function renderTasks() {
  taskList.innerHTML = ''; // Clear the task list
  tasks[currentProfile].forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.className = task.completed ? 'completed-task' : '';

    taskItem.innerHTML = `
      <span>${task.task}</span>
      <button class="complete-btn" onclick="completeTask(${index})" ${task.completed ? 'style="display: none;"' : ''}>Complete</button>
      <button class="undo-btn" onclick="undoTask(${index})" ${task.completed ? '' : 'style="display: none;"'}>Undo</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;

    taskList.appendChild(taskItem);
  });

  // Update progress bar
  updateProgress();
}

// Login function
function login() {
  currentProfile = profileSelect.value;
  profileHeader.textContent = `${currentProfile}'s To-Do List`;
  loginPage.style.display = 'none'; // Hide the login page
  taskPage.style.display = 'block'; // Show the task page
  renderTasks(); // Render tasks for the selected profile
}

// Logout function
function logout() {
  currentProfile = null;
  taskPage.style.display = 'none'; // Hide the task page
  loginPage.style.display = 'block'; // Show the login page
  taskInput.value = ''; // Clear the input field
}

// Event listeners
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Load tasks from localStorage on page load
loadTasks();
