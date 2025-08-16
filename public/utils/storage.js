// Local storage utilities
export const storage = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage save error:', error);
    }
  },

  load: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
};