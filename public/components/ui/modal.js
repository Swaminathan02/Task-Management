// Modal component
import { dom } from '../../utils/dom.js';

export class Modal {
  constructor() {
    this.modalElement = dom.getElementById('edit-modal');
  }

  populateAndShow(task) {
    // Populate edit form
    dom.getElementById('edit-task-id').value = task._id;
    dom.getElementById('edit-task-title').value = task.title;
    dom.getElementById('edit-task-priority').value = task.priority;
    dom.getElementById('edit-task-completed').checked = task.completed;
    dom.getElementById('edit-task-estimated-hours').value = task.estimatedHours;
    dom.getElementById('edit-task-description').value = task.description || '';

    this.show();
  }

  show() {
    dom.removeClass(this.modalElement, 'hidden');
  }

  close() {
    dom.addClass(this.modalElement, 'hidden');
  }
}