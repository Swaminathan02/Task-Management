// Task handlers
import { taskService } from '../../services/task.service.js';
import { appState } from '../../state/app-state.js';
import { loading } from '../shared/loading.js';
import { messages } from '../shared/messages.js';
import { dom } from '../../utils/dom.js';

export class TaskHandlers {
  constructor(taskManager, taskForm, modal) {
    this.taskManager = taskManager;
    this.taskForm = taskForm;
    this.modal = modal;
  }

  async handleTaskSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const editId = e.target.getAttribute('data-edit-id');

    const taskData = {
      title: formData.get('title'),
      priority: formData.get('priority'),
      completed: formData.has('completed'),
      estimatedHours: parseFloat(formData.get('estimatedHours')),
      description: formData.get('description') || '',
      userId: appState.currentUser._id,
    };

    try {
      loading.show();

      if (editId) {
        await taskService.updateTask(editId, taskData);
        messages.showTaskMessage('Task updated successfully!', 'success');
      } else {
        await taskService.createTask(taskData);
        messages.showTaskMessage('Task created successfully!', 'success');
      }

      loading.hide();
      this.taskForm.hide();
      this.taskManager.loadTasks();
    } catch (error) {
      loading.hide();
      messages.showTaskMessage(error.message || 'Failed to save task', 'error');
    }
  }

  async toggleTaskStatus(taskId) {
    const task = appState.tasks.find(t => t._id === taskId);
    if (!task) return;

    try {
      loading.show();
      await taskService.toggleTaskStatus(taskId, task);
      loading.hide();

      messages.showTaskMessage(
        `Task ${!task.completed ? 'completed' : 'reopened'}!`,
        'success'
      );
      this.taskManager.loadTasks();
    } catch (error) {
      loading.hide();
      messages.showTaskMessage(error.message || 'Failed to update task status', 'error');
    }
  }

  openEditModal(taskId) {
    const task = appState.tasks.find(t => t._id === taskId);
    if (!task) return;

    this.modal.populateAndShow(task);
  }

  async handleEditSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskId = formData.get('id') || dom.getElementById('edit-task-id').value;

    const taskData = {
      title: formData.get('title'),
      priority: formData.get('priority'),
      completed: formData.has('completed'),
      estimatedHours: parseFloat(formData.get('estimatedHours')),
      description: formData.get('description') || '',
      userId: appState.currentUser._id,
    };

    try {
      loading.show();
      await taskService.updateTask(taskId, taskData);
      loading.hide();

      messages.showTaskMessage('Task updated successfully!', 'success');
      this.modal.close();
      this.taskManager.loadTasks();
    } catch (error) {
      loading.hide();
      messages.showTaskMessage(error.message || 'Failed to update task', 'error');
    }
  }

  async deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      loading.show();
      await taskService.deleteTask(taskId);
      loading.hide();

      messages.showTaskMessage('Task deleted successfully!', 'success');
      this.taskManager.loadTasks();
    } catch (error) {
      loading.hide();
      messages.showTaskMessage(error.message || 'Failed to delete task', 'error');
    }
  }
}