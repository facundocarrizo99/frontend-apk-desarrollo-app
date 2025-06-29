// Cocinando/types/Recipe.ts
export interface Recipe {
   _id: string;
   id: string;
   title: string;
   description?: string;
   ingredients?: string[];
   instructions?: string[];
   image: string;
   author: {
       _id: string;
       name: string;
       avatar?: string;
   };
   createdAt: string;
   updatedAt: string;
   approved?: boolean;
   __v?: number;
}


// Interface para la respuesta de la API de recetas
export interface RecipesApiResponse {
   status: string;
   results: number;
   data: {
       recetas: Recipe[];
   };
}


// Interface User basada en la respuesta real de la API
export interface User {
   _id: string;
   id: string;
   name: string;
   email: string;
   avatar: string;
   role: 'admin' | 'alumno';
   createdAt: string;
   updatedAt: string;
   __v: number;
   // Campos adicionales para la UI (calculados o por defecto)
   age?: number;
   nationality?: string;
   recipesCount?: number;
}


// Respuesta completa de la API de login
export interface LoginApiResponse {
   status: string;
   token: string;
   refreshToken: string;
   data: {
       user: User;
   };
}


// Respuesta simplificada para el UserManager
export interface LoginResponse {
   success: boolean;
   user?: User;
   token?: string;
   refreshToken?: string;
   error?: string;
}