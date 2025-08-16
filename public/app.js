// Main application entry point
import { storage } from './utils/storage.js';
import { updateState, resetState } from './state/app-state.js';
import { dom } from './utils/dom.js';

// Components
import { AuthComponent } from './components/auth/auth.js';
import { AuthHandlers } from './components/auth/auth-handlers.js';
import { TaskManager } from './components/tasks/task-manager.js';
import { TaskForm } from './components/tasks/task-form.js';
import { TaskList } from './components/tasks/task-list.js';
import { TaskHandlers } from './components/tasks/task-handlers.js';
import { Modal } from './components/ui/modal.js';
import { Pagination } from './components/ui/pagination.js';
import { Filters } from './components/ui/filters.js';
import { Stats } from './components/ui/stats.js';

// Global app instance
class App {
  constructor() {
    this.components = {};
    this.handlers = {};
  }

  async initialize() {
    try {
      // Initialize all components
      this.initializeComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize app state
      this.initializeAppState();
      
      console.log('🚀 Task Manager App initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
    }
  }

  initializeComponents() {
    // Initialize UI components
    this.components.auth = new AuthComponent();
    this.components.taskForm = new TaskForm();
    this.components.modal = new Modal();
    this.components.stats = new Stats();

    // Initialize task-related components (order matters for dependencies)
    this.components.taskHandlers = new TaskHandlers(null, this.components.taskForm, this.components.modal);
    this.components.taskList = new TaskList(this.components.taskHandlers);
    this.components.filters = new Filters(null); // Will be set later
    this.components.pagination = new Pagination(null); // Will be set later
    
    // Initialize task manager with all dependencies
    this.components.taskManager = new TaskManager(
      this.components.taskList,
      this.components.pagination,
      this.components.stats,
      this.components.filters
    );

    // Update references now that taskManager exists
    this.components.taskHandlers.taskManager = this.components.taskManager;
    this.components.filters.taskManager = this.components.taskManager;
    this.components.pagination.taskManager = this.components.taskManager;

    // Initialize auth handlers
    this.components.authHandlers = new AuthHandlers(
      this.components.auth,
      this.components.taskManager
    );

    // Make task handlers globally accessible for onclick events
    window.taskHandlers = this.components.taskHandlers;
  }

  setupEventListeners() {
    // Auth tab switching
    const loginTab = dom.getElementById('login-tab');
    const signupTab = dom.getElementById('signup-tab');
    
    if (loginTab) {
      loginTab.addEventListener('click', () => this.components.auth.switchTab('login'));
    }
    if (signupTab) {
      signupTab.addEventListener('click', () => this.components.auth.switchTab('signup'));
    }

    // Auth forms
    const loginForm = dom.getElementById('login-form');
    const signupForm = dom.getElementById('signup-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.components.authHandlers.handleLogin(e));
    }
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.components.authHandlers.handleSignup(e));
    }

    // Logout
    const logoutBtn = dom.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.components.authHandlers.handleLogout());
    }

    // Task form
    const toggleFormBtn = dom.getElementById('toggle-form-btn');
    const taskForm = dom.getElementById('task-form');
    const cancelFormBtn = dom.getElementById('cancel-form-btn');
    
    if (toggleFormBtn) {
      toggleFormBtn.addEventListener('click', () => this.components.taskForm.toggle());
    }
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => this.components.taskHandlers.handleTaskSubmit(e));
    }
    if (cancelFormBtn) {
      cancelFormBtn.addEventListener('click', () => this.components.taskForm.hide());
    }

    // Search and filters
    const searchBtn = dom.getElementById('search-btn');
    const searchInput = dom.getElementById('search-input');
    const priorityFilter = dom.getElementById('priority-filter');
    const statusFilter = dom.getElementById('status-filter');
    const sortSelect = dom.getElementById('sort-select');
    const clearFiltersBtn = dom.getElementById('clear-filters-btn');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.components.filters.handleSearch());
    }
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.components.filters.handleSearch();
      });
    }
    if (priorityFilter) {
      priorityFilter.addEventListener('change', () => this.components.filters.handleFilterChange());
    }
    if (statusFilter) {
      statusFilter.addEventListener('change', () => this.components.filters.handleFilterChange());
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.components.filters.handleFilterChange());
    }
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => this.components.filters.clear());
    }

    // Pagination
    const prevBtn = dom.getElementById('prev-btn');
    const nextBtn = dom.getElementById('next-btn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.components.taskManager.changePage(this.components.taskManager.appState?.currentPage - 1 || 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.components.taskManager.changePage(this.components.taskManager.appState?.currentPage + 1 || 1);
      });
    }

    // Modal
    const editModal = dom.getElementById('edit-modal');
    const editTaskForm = dom.getElementById('edit-task-form');
    
    if (editModal) {
      editModal.addEventListener('click', (e) => {
        if (
          e.target === editModal ||
          e.target.classList.contains('modal-close') ||
          e.target.classList.contains('modal-cancel')
        ) {
          this.components.modal.close();
        }
      });
    }
    if (editTaskForm) {
      editTaskForm.addEventListener('submit', (e) => this.components.taskHandlers.handleEditSubmit(e));
    }

    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });
  }

  initializeAppState() {
    // Check if user is already logged in
    const savedUser = storage.load('currentUser');
    if (savedUser) {
      updateState({ currentUser: savedUser });
      this.components.auth.showTaskPage();
      this.components.taskManager.loadTasks();
    } else {
      this.components.auth.showAuthPage();
    }
  }

  // Public methods for manual control (useful for debugging)
  getComponent(name) {
    return this.components[name];
  }

  getHandler(name) {
    return this.handlers[name];
  }

  // Cleanup method
  destroy() {
    // Remove global references
    delete window.taskHandlers;
    
    // Reset state
    resetState();
    
    console.log('🧹 App destroyed and cleaned up');
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    window.app = new App();
    await window.app.initialize();
  } catch (error) {
    console.error('Failed to start application:', error);
  }
});

// Export for potential external use
export default App;