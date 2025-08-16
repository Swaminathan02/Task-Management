// Authentication service
import { apiService } from './api.js';
import { API_CONFIG } from '../config/config.js';
import { storage } from '../utils/storage.js';
import { updateState } from '../state/app-state.js';

export const authService = {
  async login(credentials) {
    const { data } = await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    
    updateState({ currentUser: data.user });
    storage.save('currentUser', data.user);
    storage.save('token', data.token);
    
    return data;
  },

  async signup(userData) {
    const { data } = await apiService.post(API_CONFIG.ENDPOINTS.SIGNUP, userData);
    
    updateState({ currentUser: data.user });
    storage.save('currentUser', data.user);
    storage.save('token', data.token);
    
    return data;
  },

  logout() {
    updateState({ currentUser: null });
    storage.remove('currentUser');
    storage.remove('token');
  },

  isAuthenticated() {
    return !!storage.load('token');
  },

  getCurrentUser() {
    return storage.load('currentUser');
  }
};