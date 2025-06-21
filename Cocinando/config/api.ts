// Base API configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
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
    FAVORITES: '/users/favorites',
    ADD_FAVORITE: (id: string) => `/users/favorites/${id}`,
    REMOVE_FAVORITE: (id: string) => `/users/favorites/${id}`,
  },
  
  // Recipes
  RECIPES: {
    BASE: '/recipes',
    BY_ID: (id: string) => `/recipes/${id}`,
    BY_USER: (userId: string) => `/recipes/user/${userId}`,
    CATEGORIES: '/recipes/categories',
    SEARCH: '/recipes/search',
  },
  
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    RECIPES: '/admin/recipes',
    RECIPE_BY_ID: (id: string) => `/admin/recipes/${id}`,
    REPORTS: '/admin/reports',
    RESOLVE_REPORT: (id: string) => `/admin/reports/resolve/${id}`,
  },
  
  // Upload
  UPLOAD: '/upload',
};

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
