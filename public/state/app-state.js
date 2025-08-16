// Global state management
import { APP_CONFIG } from '../config/config.js';

export let appState = {
  currentUser: null,
  tasks: [],
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: APP_CONFIG.ITEMS_PER_PAGE,
  currentFilters: { ...APP_CONFIG.DEFAULT_FILTERS }
};

export const updateState = (newState) => {
  Object.assign(appState, newState);
};

export const resetState = () => {
  appState.currentUser = null;
  appState.tasks = [];
  appState.currentPage = 1;
  appState.totalPages = 1;
  appState.currentFilters = { ...APP_CONFIG.DEFAULT_FILTERS };
};