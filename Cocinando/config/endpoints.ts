export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
    UPDATE_AVATAR: '/users/me/avatar',
    CHANGE_PASSWORD: '/users/me/password',
    FAVORITES: '/users/me/favorites',
    FAVORITE: (id: string) => `/users/me/favorites/${id}`,
  },
  
  // Recipes
  RECIPES: {
    BASE: '/recipes',
    BY_ID: (id: string) => `/recipes/${id}`,
    BY_USER: (userId: string) => `/users/${userId}/recipes`,
    CATEGORIES: '/recipes/categories',
    SEARCH: '/recipes/search',
  },
  
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    USER_STATUS: (id: string) => `/admin/users/${id}/status`,
    RECIPES: '/admin/recipes',
    RECIPE_BY_ID: (id: string) => `/admin/recipes/${id}`,
    REPORTS: '/admin/reports',
    REPORT: (id: string) => `/admin/reports/${id}`,
    RESOLVE_REPORT: (id: string) => `/admin/reports/${id}/resolve`,
    STATS: '/admin/stats',
  },
  
  // Upload
  UPLOAD: '/upload',
};

export const QUERY_KEYS = {
  // Auth
  CURRENT_USER: 'currentUser',
  
  // Recipes
  RECIPES: 'recipes',
  RECIPE: (id: string) => ['recipe', id],
  USER_RECIPES: (userId: string) => ['userRecipes', userId],
  FAVORITES: 'favorites',
  SEARCH_RECIPES: 'searchRecipes',
  CATEGORIES: 'categories',
  
  // Users
  USERS: 'users',
  USER: (id: string) => ['user', id],
  
  // Admin
  ADMIN_STATS: 'adminStats',
  ADMIN_USERS: 'adminUsers',
  ADMIN_USER: (id: string) => ['adminUser', id],
  ADMIN_RECIPES: 'adminRecipes',
  ADMIN_REPORTS: 'adminReports',
};

export const QUERY_OPTIONS = {
  // Default cache time: 5 minutes
  defaultCacheTime: 1000 * 60 * 5,
  // Default stale time: 1 minute
  defaultStaleTime: 1000 * 60,
  // Retry failed requests 3 times
  defaultRetry: 3,
};
