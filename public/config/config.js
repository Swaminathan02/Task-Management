// API Configuration
export const API_CONFIG = {
  BASE_URL: "/api",
  ENDPOINTS: {

    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    TASKS: "/tasks"
  }
};

export const APP_CONFIG = {
  ITEMS_PER_PAGE: 5,
  DEFAULT_FILTERS: {
    search: "",
    priority: "",
    status: "",
    sort: "createdAt",
  }
};