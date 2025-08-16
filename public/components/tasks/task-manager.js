// Task manager component
import { taskService } from '../../services/task.service.js';
import { appState, updateState } from '../../state/app-state.js';
import { loading } from '../shared/loading.js';
import { messages } from '../shared/messages.js';

export class TaskManager {
  constructor(taskList, pagination, stats, filters) {
    this.taskList = taskList;
    this.pagination = pagination;
    this.stats = stats;
    this.filters = filters;
  }

  async loadTasks() {
    if (!appState.currentUser) return;

    try {
      loading.show();
      const params = {
        page: appState.currentPage,
        limit: appState.itemsPerPage,
        ...appState.currentFilters,
      };

      const result = await taskService.getTasks(params);
      loading.hide();

      updateState({
        tasks: result.tasks,
        totalPages: result.totalPages
      });

      this.taskList.display();
      this.pagination.update();
      this.stats.update();
    } catch (error) {
      loading.hide();
      messages.showTaskMessage(error.message || 'Failed to load tasks', 'error');
    }
  }

  resetTasks() {
    updateState({ tasks: [] });
  }

  clearFilters() {
    this.filters.clear();
  }

  changePage(page) {
    if (page >= 1 && page <= appState.totalPages) {
      updateState({ currentPage: page });
      this.loadTasks();
    }
  }
}