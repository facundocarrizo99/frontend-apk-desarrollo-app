// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  bio?: string;
  phone?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Recipe related types
export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  id: string;
  description: string;
  order: number;
  image?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  rating?: number;
  image: string;
  ingredients: Ingredient[];
  steps: Step[];
  categories: string[];
  tags: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  author: Pick<User, 'id' | 'name' | 'avatar'>;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Search and filter types
export interface RecipeFilters {
  categories?: string[];
  difficulty?: ('easy' | 'medium' | 'hard')[];
  prepTime?: number; // max prep time in minutes
  cookTime?: number; // max cook time in minutes
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  sortBy?: 'newest' | 'popular' | 'rating' | 'prepTime' | 'cookTime';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Admin types
export interface AdminUser extends User {
  isActive: boolean;
  recipeCount: number;
  lastLogin?: string;
}

export interface Report {
  id: string;
  type: 'recipe' | 'user' | 'comment' | 'other';
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reportedItem: {
    id: string;
    type: 'recipe' | 'user' | 'comment';
    name?: string;
    title?: string;
    content?: string;
  };
  reporter: Pick<User, 'id' | 'name' | 'email'>;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: Pick<User, 'id' | 'name'>;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface RecipeFormData {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Array<{ name: string; amount: string; unit: string }>;
  steps: Array<{ description: string; image?: string }>;
  categories: string[];
  tags: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  image?: string;
}

export class CreateRecipeData {
}

export class LoginCredentials {
}

export class RegisterData {
}