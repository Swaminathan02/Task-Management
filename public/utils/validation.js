// Validation utilities
export const validation = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation
  isValidPassword: (password) => {
    // At least 6 characters
    return password && password.length >= 6;
  },

  // Username validation
  isValidUsername: (username) => {
    // At least 3 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  },

  // Task title validation
  isValidTaskTitle: (title) => {
    return title && title.trim().length >= 3 && title.trim().length <= 100;
  },

  // Estimated hours validation
  isValidEstimatedHours: (hours) => {
    const numHours = parseFloat(hours);
    return !isNaN(numHours) && numHours >= 0.1 && numHours <= 1000;
  },

  // Priority validation
  isValidPriority: (priority) => {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    return validPriorities.includes(priority);
  },

  // Task description validation
  isValidDescription: (description) => {
    // Optional field, but if provided should not exceed 500 characters
    return !description || description.length <= 500;
  },

  // Form validation helper
  validateLoginForm: (formData) => {
    const errors = {};
    
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || username.trim().length === 0) {
      errors.username = 'Username is required';
    }

    if (!password || password.length === 0) {
      errors.password = 'Password is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateSignupForm: (formData) => {
    const errors = {};
    
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!username || !validation.isValidUsername(username)) {
      errors.username = 'Username must be at least 3 characters and contain only letters, numbers, and underscores';
    }

    if (!email || !validation.isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password || !validation.isValidPassword(password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateTaskForm: (formData) => {
    const errors = {};
    
    const title = formData.get('title');
    const priority = formData.get('priority');
    const estimatedHours = formData.get('estimatedHours');
    const description = formData.get('description');

    if (!title || !validation.isValidTaskTitle(title)) {
      errors.title = 'Task title must be between 3 and 100 characters';
    }

    if (!priority || !validation.isValidPriority(priority)) {
      errors.priority = 'Please select a valid priority level';
    }

    if (!estimatedHours || !validation.isValidEstimatedHours(estimatedHours)) {
      errors.estimatedHours = 'Estimated hours must be between 0.1 and 1000';
    }

    if (description && !validation.isValidDescription(description)) {
      errors.description = 'Description must not exceed 500 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Sanitization helpers
  sanitizeInput: (input) => {
    return input ? input.trim().replace(/[<>]/g, '') : '';
  },

  // Display validation errors
  displayErrors: (errors, containerElement) => {
    if (!containerElement) return;
    
    const errorHtml = Object.values(errors)
      .map(error => `<div class="error-item">${error}</div>`)
      .join('');
    
    containerElement.innerHTML = errorHtml;
    containerElement.style.display = errorHtml ? 'block' : 'none';
  }
};