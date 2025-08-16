// Task service
import { apiService } from './api.js';
import { API_CONFIG } from '../config/config.js';

export const taskService = {
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.TASKS}${queryString ? `?${queryString}` : ''}`;
    const { data } = await apiService.get(endpoint);
    return data;
  },

  async createTask(taskData) {
    const { data } = await apiService.post(API_CONFIG.ENDPOINTS.TASKS, taskData);
    return data;
  },

  async updateTask(taskId, taskData) {
    const { data } = await apiService.put(`${API_CONFIG.ENDPOINTS.TASKS}/${taskId}`, taskData);
    return data;
  },

  async deleteTask(taskId) {
    const { data } = await apiService.delete(`${API_CONFIG.ENDPOINTS.TASKS}/${taskId}`);
    return data;
  },

  async toggleTaskStatus(taskId, currentTask) {
    const updatedTask = { ...currentTask, completed: !currentTask.completed };
    return this.updateTask(taskId, updatedTask);
  }
};