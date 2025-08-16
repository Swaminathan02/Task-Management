// Authentication handlers
import { authService } from '../../services/auth.service.js';
import { loading } from '../shared/loading.js';
import { messages } from '../shared/messages.js';

export class AuthHandlers {
  constructor(authComponent, taskManager) {
    this.auth = authComponent;
    this.taskManager = taskManager;
  }

  async handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    try {
      loading.show();
      await authService.login(loginData);
      loading.hide();

      messages.showAuthMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        messages.clearAuthMessage();
        this.auth.showTaskPage();
        this.taskManager.loadTasks();
      }, 1500);
    } catch (error) {
      loading.hide();
      messages.showAuthMessage(error.message || 'Login failed', 'error');
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const signupData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      loading.show();
      await authService.signup(signupData);
      loading.hide();

      messages.showAuthMessage('Account created successfully! Redirecting...', 'success');
      setTimeout(() => {
        messages.clearAuthMessage();
        this.auth.showTaskPage();
        this.taskManager.loadTasks();
      }, 1500);
    } catch (error) {
      loading.hide();
      messages.showAuthMessage(error.message || 'Signup failed', 'error');
    }
  }

  handleLogout() {
    authService.logout();
    this.taskManager.resetTasks();
    this.taskManager.clearFilters();
    
    messages.showAuthMessage('Logged out successfully!', 'success');
    setTimeout(() => {
      messages.clearAuthMessage();
      this.auth.showAuthPage();
    }, 1500);
  }
}