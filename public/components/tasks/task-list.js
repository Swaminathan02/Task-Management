// Task list component
import { dom } from '../../utils/dom.js';
import { appState } from '../../state/app-state.js';
import { escapeHtml, getPriorityScore, formatDate, calculateDaysSinceCreation } from '../../utils/helpers.js';

export class TaskList {
  constructor(taskHandlers) {
    this.taskListElement = dom.getElementById('task-list');
    this.handlers = taskHandlers;
  }

  display() {
    if (appState.tasks.length === 0) {
      dom.setContent(this.taskListElement, `
        <div class="empty-state">
          <h3>No tasks found</h3>
          <p>Start by creating your first task!</p>
        </div>
      `);
      return;
    }

    const tasksHtml = appState.tasks.map(task => this.renderTask(task)).join('');
    dom.setContent(this.taskListElement, tasksHtml);
  }

  renderTask(task) {
    const createdDate = formatDate(task.createdAt);
    const completionRate = task.completed ? 100 : 0;
    const daysSinceCreation = calculateDaysSinceCreation(task.createdAt);

    return `
      <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task._id}">
        <div class="task-header-row">
          <h3 class="task-title">${escapeHtml(task.title)}</h3>
          <div class="task-actions">
            <button class="action-btn toggle-status-btn" onclick="window.taskHandlers.toggleTaskStatus('${task._id}')">
              ${task.completed ? '↩️ Undo' : '✅ Complete'}
            </button>
            <button class="action-btn edit-btn" onclick="window.taskHandlers.openEditModal('${task._id}')">✏️ Edit</button>
            <button class="action-btn delete-btn" onclick="window.taskHandlers.deleteTask('${task._id}')">🗑️ Delete</button>
          </div>
        </div>
        
        <div class="task-info">
          <div class="task-meta">
            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
            <span>📅 Created: ${createdDate}</span>
            <span>⏱️ Est: ${task.estimatedHours}h</span>
            <span>📊 Status: ${task.completed ? 'Completed' : 'Pending'}</span>
          </div>
        </div>
        
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        
        <div class="calculated-field">
          <strong>📈 Task Metrics:</strong> 
          Completion Rate: ${completionRate}% | 
          Priority Score: ${getPriorityScore(task.priority)} | 
          Days Since Creation: ${daysSinceCreation}
        </div>
      </div>
    `;
  }
}