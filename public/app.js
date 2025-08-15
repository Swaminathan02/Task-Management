// Global state management
let currentUser = null;
let tasks = [];
let currentPage = 1;
let totalPages = 1;
let itemsPerPage = 5;
let currentFilters = {
  search: "",
  priority: "",
  status: "",
  sort: "createdAt",
};

// API Base URL - change this to your backend URL
const API_BASE = "https://task-management-k8ce.onrender.com/api";

// DOM Elements
const authPage = document.getElementById("auth-page");
const taskPage = document.getElementById("task-page");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authMessage = document.getElementById("auth-message");
const taskMessage = document.getElementById("task-message");
const loading = document.getElementById("loading");

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showTaskPage();
  } else {
    showAuthPage();
  }
}

function showAuthPage() {
  authPage.classList.add("active");
  taskPage.classList.remove("active");
}

function showTaskPage() {
  authPage.classList.remove("active");
  taskPage.classList.add("active");

  if (currentUser) {
    document.getElementById(
      "username-display"
    ).textContent = `Welcome, ${currentUser.username}!`;
    loadTasks();
  }
}

function setupEventListeners() {
  // Auth tab switching
  document
    .getElementById("login-tab")
    .addEventListener("click", () => switchTab("login"));
  document
    .getElementById("signup-tab")
    .addEventListener("click", () => switchTab("signup"));

  // Auth forms
  loginForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);

  // Logout
  document.getElementById("logout-btn").addEventListener("click", handleLogout);

  // Task form
  document
    .getElementById("toggle-form-btn")
    .addEventListener("click", toggleTaskForm);
  document
    .getElementById("task-form")
    .addEventListener("submit", handleTaskSubmit);
  document
    .getElementById("cancel-form-btn")
    .addEventListener("click", cancelTaskForm);

  // Search and filters
  document.getElementById("search-btn").addEventListener("click", handleSearch);
  document
    .getElementById("search-input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") handleSearch();
    });
  document
    .getElementById("priority-filter")
    .addEventListener("change", handleFilterChange);
  document
    .getElementById("status-filter")
    .addEventListener("change", handleFilterChange);
  document
    .getElementById("sort-select")
    .addEventListener("change", handleFilterChange);
  document
    .getElementById("clear-filters-btn")
    .addEventListener("click", clearFilters);

  // Pagination
  document
    .getElementById("prev-btn")
    .addEventListener("click", () => changePage(currentPage - 1));
  document
    .getElementById("next-btn")
    .addEventListener("click", () => changePage(currentPage + 1));

  // Modal
  document.getElementById("edit-modal").addEventListener("click", function (e) {
    if (
      e.target === this ||
      e.target.classList.contains("modal-close") ||
      e.target.classList.contains("modal-cancel")
    ) {
      closeModal();
    }
  });
  document
    .getElementById("edit-task-form")
    .addEventListener("submit", handleEditSubmit);
}

// Authentication functions
function switchTab(tab) {
  const loginTab = document.getElementById("login-tab");
  const signupTab = document.getElementById("signup-tab");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (tab === "login") {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  } else {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  }
  clearAuthMessage();
}

async function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const loginData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    showLoading();
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    hideLoading();

    if (response.ok) {
      currentUser = result.user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("token", result.token);
      showAuthMessage("Login successful! Redirecting...", "success");
      setTimeout(() => {
        clearAuthMessage();
        showTaskPage();
      }, 1500);
    } else {
      showAuthMessage(result.message || "Login failed", "error");
    }
  } catch (error) {
    hideLoading();
    showAuthMessage("Network error. Please try again.", "error");
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const signupData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    showLoading();
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });

    const result = await response.json();
    hideLoading();

    if (response.ok) {
      currentUser = result.user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("token", result.token);

      showAuthMessage(
        "Account created successfully! Redirecting...",
        "success"
      );
      setTimeout(() => {
        clearAuthMessage();
        showTaskPage();
      }, 1500);
    } else {
      showAuthMessage(result.message || "Signup failed", "error");
    }
  } catch (error) {
    hideLoading();
    showAuthMessage("Network error. Please try again.", "error");
  }
}

function handleLogout() {
  currentUser = null;
  tasks = [];
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");

  resetTaskForm();
  clearFilters();
  showAuthMessage("Logged out successfully!", "success");
  setTimeout(() => {
    clearAuthMessage();
    showAuthPage();
  }, 1500);
}

// Task management functions
async function loadTasks() {
  if (!currentUser) return;

  try {
    showLoading();
    const params = new URLSearchParams({
      page: currentPage,
      limit: itemsPerPage,
      ...currentFilters,
    });

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/tasks?${params}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    hideLoading();

    if (response.ok) {
      tasks = result.tasks;
      totalPages = result.totalPages;
      displayTasks();
      updatePagination();
      updateStats();
    } else {
      showTaskMessage(result.message || "Failed to load tasks", "error");
    }
  } catch (error) {
    hideLoading();
    showTaskMessage("Network error. Please try again.", "error");
  }
}

function displayTasks() {
  const taskList = document.getElementById("task-list");

  if (tasks.length === 0) {
    taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Start by creating your first task!</p>
            </div>
        `;
    return;
  }

  taskList.innerHTML = tasks
    .map((task) => {
      const createdDate = new Date(task.createdAt).toLocaleDateString();
      const completionRate = task.completed ? 100 : 0;
      const efficiency =
        task.completed && task.estimatedHours > 0
          ? Math.round((task.estimatedHours / task.estimatedHours) * 100)
          : 0;

      return `
            <div class="task-item ${
              task.completed ? "completed" : ""
            }" data-id="${task._id}">
                <div class="task-header-row">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    <div class="task-actions">
                        <button class="action-btn toggle-status-btn" onclick="toggleTaskStatus('${
                          task._id
                        }')">
                            ${task.completed ? "↩️ Undo" : "✅ Complete"}
                        </button>
                        <button class="action-btn edit-btn" onclick="openEditModal('${
                          task._id
                        }')">✏️ Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteTask('${
                          task._id
                        }')">🗑️ Delete</button>
                    </div>
                </div>
                
                <div class="task-info">
                    <div class="task-meta">
                        <span class="priority-badge priority-${
                          task.priority
                        }">${task.priority}</span>
                        <span>📅 Created: ${createdDate}</span>
                        <span>⏱️ Est: ${task.estimatedHours}h</span>
                        <span>📊 Status: ${
                          task.completed ? "Completed" : "Pending"
                        }</span>
                    </div>
                </div>
                
                ${
                  task.description
                    ? `<div class="task-description">${escapeHtml(
                        task.description
                      )}</div>`
                    : ""
                }
                
                <div class="calculated-field">
                    <strong>📈 Task Metrics:</strong> 
                    Completion Rate: ${completionRate}% | 
                    Priority Score: ${getPriorityScore(task.priority)} | 
                    Days Since Creation: ${Math.floor(
                      (new Date() - new Date(task.createdAt)) /
                        (1000 * 60 * 60 * 24)
                    )}
                </div>
            </div>
        `;
    })
    .join("");
}

function toggleTaskForm() {
  const form = document.getElementById("task-form");
  const button = document.getElementById("toggle-form-btn");

  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    button.textContent = "❌ Cancel";
  } else {
    form.classList.add("hidden");
    button.textContent = "+ Add New Task";
    resetTaskForm();
  }
}

function cancelTaskForm() {
  const form = document.getElementById("task-form");
  const button = document.getElementById("toggle-form-btn");

  form.classList.add("hidden");
  button.textContent = "+ Add New Task";
  resetTaskForm();
}

function resetTaskForm() {
  document.getElementById("task-form").reset();
  document.getElementById("form-submit-text").textContent = "Create Task";
  document.getElementById("task-form").removeAttribute("data-edit-id");
}

async function handleTaskSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const editId = e.target.getAttribute("data-edit-id");

  const taskData = {
    title: formData.get("title"),
    priority: formData.get("priority"),
    completed: formData.has("completed"),
    estimatedHours: parseFloat(formData.get("estimatedHours")),
    description: formData.get("description") || "",
    userId: currentUser._id,
  };

  try {
    showLoading();

    // Correctly use dynamic URL and method
    const url = editId ? `${API_BASE}/tasks/${editId}` : `${API_BASE}/tasks`;
    const method = editId ? "PUT" : "POST";

    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData), // send taskData instead of undefined task
    });

    const result = await response.json();
    hideLoading();

    if (response.ok) {
      showTaskMessage(
        editId ? "Task updated successfully!" : "Task created successfully!",
        "success"
      );
      cancelTaskForm();
      loadTasks();
    } else {
      showTaskMessage(result.message || "Failed to save task", "error");
    }
  } catch (error) {
    hideLoading();
    console.error("Error in handleTaskSubmit:", error);
    showTaskMessage("Network error. Please try again.", "error");
  }
}

async function toggleTaskStatus(taskId) {
  const task = tasks.find((t) => t._id === taskId);
  if (!task) return;

  try {
    showLoading();

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });

    hideLoading();

    if (response.ok) {
      showTaskMessage(
        `Task ${!task.completed ? "completed" : "reopened"}!`,
        "success"
      );
      loadTasks();
    } else {
      showTaskMessage("Failed to update task status", "error");
    }
  } catch (error) {
    hideLoading();
    showTaskMessage("Network error. Please try again.", "error");
  }
}

function openEditModal(taskId) {
  const task = tasks.find((t) => t._id === taskId);
  if (!task) return;

  // Populate edit form
  document.getElementById("edit-task-id").value = task._id;
  document.getElementById("edit-task-title").value = task.title;
  document.getElementById("edit-task-priority").value = task.priority;
  document.getElementById("edit-task-completed").checked = task.completed;
  document.getElementById("edit-task-estimated-hours").value =
    task.estimatedHours;
  document.getElementById("edit-task-description").value =
    task.description || "";

  // Show modal
  document.getElementById("edit-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("edit-modal").classList.add("hidden");
}

async function handleEditSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const taskId =
    formData.get("id") || document.getElementById("edit-task-id").value;

  const taskData = {
    title: formData.get("title"),
    priority: formData.get("priority"),
    completed: formData.has("completed"),
    estimatedHours: parseFloat(formData.get("estimatedHours")),
    description: formData.get("description") || "",
    userId: currentUser._id,
  };

  try {
    showLoading();

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    hideLoading();

    if (response.ok) {
      showTaskMessage("Task updated successfully!", "success");
      closeModal();
      loadTasks();
    } else {
      showTaskMessage("Failed to update task", "error");
    }
  } catch (error) {
    hideLoading();
    showTaskMessage("Network error. Please try again.", "error");
  }
}

async function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    showLoading();

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    hideLoading();

    if (response.ok) {
      showTaskMessage("Task deleted successfully!", "success");
      loadTasks();
    } else {
      showTaskMessage("Failed to delete task", "error");
    }
  } catch (error) {
    hideLoading();
    showTaskMessage("Network error. Please try again.", "error");
  }
}

// Filter and search functions
function handleSearch() {
  currentFilters.search = document.getElementById("search-input").value.trim();
  currentPage = 1;
  loadTasks();
}

function handleFilterChange() {
  currentFilters.priority = document.getElementById("priority-filter").value;
  currentFilters.status = document.getElementById("status-filter").value;
  currentFilters.sort = document.getElementById("sort-select").value;
  currentPage = 1;
  loadTasks();
}

function clearFilters() {
  document.getElementById("search-input").value = "";
  document.getElementById("priority-filter").value = "";
  document.getElementById("status-filter").value = "";
  document.getElementById("sort-select").value = "createdAt";

  currentFilters = {
    search: "",
    priority: "",
    status: "",
    sort: "createdAt",
  };
  currentPage = 1;
  loadTasks();
}

// Pagination functions
function changePage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    loadTasks();
  }
}

function updatePagination() {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, tasks.length + start - 1);
  const total = tasks.length; // This should be total from API

  document.getElementById(
    "pagination-info"
  ).textContent = `Showing ${start}-${end} of ${total} tasks`;

  document.getElementById("prev-btn").disabled = currentPage === 1;
  document.getElementById("next-btn").disabled = currentPage === totalPages;

  // Generate page numbers
  const pageNumbers = document.getElementById("page-numbers");
  pageNumbers.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-number ${i === currentPage ? "active" : ""}`;
    pageBtn.textContent = i;
    pageBtn.onclick = () => changePage(i);
    pageNumbers.appendChild(pageBtn);
  }
}

function updateStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const totalHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  document.getElementById("total-tasks").textContent = totalTasks;
  document.getElementById("completed-tasks").textContent = completedTasks;
  document.getElementById("pending-tasks").textContent = pendingTasks;
  document.getElementById("total-hours").textContent = totalHours.toFixed(1);
}

// Utility functions
function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showAuthMessage(message, type) {
  authMessage.textContent = message;
  authMessage.className = `message ${type}`;
}

function showTaskMessage(message, type) {
  taskMessage.textContent = message;
  taskMessage.className = `message ${type}`;
  setTimeout(() => {
    taskMessage.textContent = "";
    taskMessage.className = "message";
  }, 5000);
}

function clearAuthMessage() {
  authMessage.textContent = "";
  authMessage.className = "message";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getPriorityScore(priority) {
  const scores = { low: 1, medium: 2, high: 3, urgent: 4 };
  return scores[priority] || 1;
}
