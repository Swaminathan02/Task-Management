// Message component
import { dom } from '../../utils/dom.js';

class MessageComponent {
  constructor() {
    this.authMessage = dom.getElementById('auth-message');
    this.taskMessage = dom.getElementById('task-message');
  }

  showAuthMessage(message, type) {
    dom.setText(this.authMessage, message);
    this.authMessage.className = `message ${type}`;
  }

  showTaskMessage(message, type) {
    dom.setText(this.taskMessage, message);
    this.taskMessage.className = `message ${type}`;
    
    setTimeout(() => {
      this.clearTaskMessage();
    }, 5000);
  }

  clearAuthMessage() {
    dom.setText(this.authMessage, '');
    this.authMessage.className = 'message';
  }

  clearTaskMessage() {
    dom.setText(this.taskMessage, '');
    this.taskMessage.className = 'message';
  }
}

export const messages = new MessageComponent();