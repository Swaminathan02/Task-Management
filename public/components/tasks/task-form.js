// Task form component
import { dom } from '../../utils/dom.js';

export class TaskForm {
  constructor() {
    this.formElement = dom.getElementById('task-form');
    this.toggleButton = dom.getElementById('toggle-form-btn');
  }

  toggle() {
    if (dom.hasClass(this.formElement, 'hidden')) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    dom.removeClass(this.formElement, 'hidden');
    dom.setText(this.toggleButton, '❌ Cancel');
  }

  hide() {
    dom.addClass(this.formElement, 'hidden');
    dom.setText(this.toggleButton, '+ Add New Task');
    this.reset();
  }

  reset() {
    this.formElement.reset();
    const submitText = dom.getElementById('form-submit-text');
    dom.setText(submitText, 'Create Task');
    this.formElement.removeAttribute('data-edit-id');
  }

  populateForEdit(task) {
    // This would be used when editing inline (not in modal)
    // Implementation depends on specific form structure
  }
}