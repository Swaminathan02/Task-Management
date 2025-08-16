// Utility helper functions
export const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

export const getPriorityScore = (priority) => {
  const scores = { low: 1, medium: 2, high: 3, urgent: 4 };
  return scores[priority] || 1;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const calculateDaysSinceCreation = (createdAt) => {
  return Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};