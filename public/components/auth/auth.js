// Authentication component
import { dom } from '../../utils/dom.js';
import { appState } from '../../state/app-state.js';

export class AuthComponent {
  constructor() {
    this.authPage = dom.getElementById('auth-page');
    this.taskPage = dom.getElementById('task-page');
    this.loginForm = dom.getElementById('login-form');
    this.signupForm = dom.getElementById('signup-form');
  }

  showAuthPage() {
    dom.addClass(this.authPage, 'active');
    dom.removeClass(this.taskPage, 'active');
  }

  showTaskPage() {
    dom.removeClass(this.authPage, 'active');
    dom.addClass(this.taskPage, 'active');

    if (appState.currentUser) {
      const usernameDisplay = dom.getElementById('username-display');
      dom.setText(usernameDisplay, `Welcome, ${appState.currentUser.username}!`);
    }
  }

  switchTab(tab) {
    const loginTab = dom.getElementById('login-tab');
    const signupTab = dom.getElementById('signup-tab');

    if (tab === 'login') {
      dom.addClass(loginTab, 'active');
      dom.removeClass(signupTab, 'active');
      dom.addClass(this.loginForm, 'active');
      dom.removeClass(this.signupForm, 'active');
    } else {
      dom.addClass(signupTab, 'active');
      dom.removeClass(loginTab, 'active');
      dom.addClass(this.signupForm, 'active');
      dom.removeClass(this.loginForm, 'active');
    }
  }
}