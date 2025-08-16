// Filters component
import { appState, updateState } from '../../state/app-state.js';
import { dom } from '../../utils/dom.js';
import { APP_CONFIG } from '../../config/config.js';

export class Filters {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  handleSearch() {
    const searchInput = dom.getElementById('search-input');
    updateState({
      currentFilters: {
        ...appState.currentFilters,
        search: searchInput.value.trim()
      },
      currentPage: 1
    });
    this.taskManager.loadTasks();
  }

  handleFilterChange() {
    const priorityFilter = dom.getElementById('priority-filter');
    const statusFilter = dom.getElementById('status-filter');
    const sortSelect = dom.getElementById('sort-select');

    updateState({
      currentFilters: {
        ...appState.currentFilters,
        priority: priorityFilter.value,
        status: statusFilter.value,
        sort: sortSelect.value
      },
      currentPage: 1
    });
    this.taskManager.loadTasks();
  }

  clear() {
    dom.getElementById('search-input').value = '';
    dom.getElementById('priority-filter').value = '';
    dom.getElementById('status-filter').value = '';
    dom.getElementById('sort-select').value = 'createdAt';

    updateState({
      currentFilters: { ...APP_CONFIG.DEFAULT_FILTERS },
      currentPage: 1
    });
    this.taskManager.loadTasks();
  }
}