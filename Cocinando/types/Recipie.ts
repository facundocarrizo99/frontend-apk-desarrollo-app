// Cocinando/types/Recipe.ts

// Interface para ingredientes
export interface Ingredient {
    ingrediente: string;
    cantidad: number;
    unidadMedida: 'g' | 'kg' | 'ml' | 'l' | 'cdta' | 'cda' | 'taza' | 'unidad' | 'pizca';
}

// Interface para recetas (estructura de la API)
export interface Recipe {
    _id: string;
    id?: string;
    titulo: string; // API usa "titulo" en lugar de "title"
    title?: string; // Para compatibilidad con código existente
    descripcion?: string;
    ingredientes?: Ingredient[];
    pasos?: string[];
    cantidadComensales?: number;
    tags?: string[];
    imagen: string; // API usa "imagen" en lugar de "image"
    image?: string; // Para compatibilidad con código existente
    autor: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        role: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        id: string;
    };
    author?: { // Para compatibilidad con código existente
        _id: string;
        name: string;
        avatar?: string;
    };
    aprobado?: boolean;
    approved?: boolean; // Para compatibilidad con código existente
    valoracionPromedio?: number;
    comentarios?: any[];
    fechaCreacion: string;
    fechaModificacion: string;
    createdAt?: string; // Para compatibilidad con código existente
    updatedAt?: string; // Para compatibilidad con código existente
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

// Interface para la respuesta de aprobar/rechazar receta
export interface RecipeActionResponse {
    status: string;
    message?: string;
    data?: any;
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
    // Campos adicionales para edición de perfil
    apellido?: string;
    fechaNacimiento?: string;
    nacionalidad?: string; // Campo que puede venir de la API
    // Campos adicionales para la UI (calculados o por defecto)
    age?: number;
    nationality?: string; // Campo normalizado para la UI
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

// Interface para actualizar perfil
export interface UpdateProfileRequest {
    name: string;
    apellido: string;
    email: string;
    fechaNacimiento: string;
    nacionalidad: string;
}

// Respuesta de la API de actualizar perfil
export interface UpdateProfileApiResponse {
    status: string;
    message?: string;
    data?: {
        user: User;
    };
}

// Respuesta simplificada para el servicio
export interface UpdateProfileResponse {
    success: boolean;
    user?: User;
    error?: string;
}

// Interface para comentarios
export interface Comment {
    _id: string;
    texto: string;
    valoracion: number;
    usuario: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        role: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        id: string;
    };
    receta: string;
    fechaCreacion: string;
    fechaModificacion: string;
    aprobado: boolean;
    __v?: number;
}

// Interface para crear comentario
export interface CreateCommentRequest {
    texto: string;
    valoracion: number;
    receta: string;
}

// Interface para la respuesta de la API de comentarios
export interface CommentsApiResponse {
    status: string;
    results: number;
    message?: string;
    data: {
        comentarios: Comment[];
    };
}

// Interface para la respuesta de comentarios pendientes (paginada)
export interface PendingCommentsApiResponse {
    status: string;
    results: number;
    totalPages: number;
    currentPage: number;
    message?: string;
    data: {
        comentarios: Comment[];
    };
}

// Interface para la respuesta de crear comentario
export interface CreateCommentApiResponse {
    status: string;
    message?: string;
    data?: {
        comentario: Comment;
    };
}

// Interface para la respuesta de aprobar/eliminar comentario
export interface CommentActionResponse {
    status: string;
    message?: string;
    data?: any;
}

// Respuesta simplificada para el servicio de comentarios
export interface CommentResponse {
    success: boolean;
    comment?: Comment;
    comments?: Comment[];
    error?: string;
    totalPages?: number;
    currentPage?: number;
}

// Interface para crear una nueva receta
export interface CreateRecipeRequest {
    titulo: string;
    descripcion: string;
    ingredientes: Ingredient[];
    tiempoCoccion: number;
    dificultad: 'facil' | 'medio' | 'dificil';
    cantidadComensales: number;
    categoria: 'desayuno' | 'almuerzo' | 'cena' | 'postre' | 'snack' | 'aperitivo' | 'bebida' | 'salsa' | 'sopa' | 'ensalada' | 'pan' | 'otro';
    cocina: string;
    tags: ('Vegetariano' | 'Vegano' | 'SinGluten' | 'Dulce' | 'Salado' | 'Rapido' | 'Internacional' | 'Tradicional' | 'Saludable' | 'Economico')[];
    imagen?: string;
    pasos: string[];
}

// Interface para la respuesta de crear receta
export interface CreateRecipeApiResponse {
    status: string;
    message?: string;
    data?: {
        receta: Recipe;
    };
}

// Respuesta simplificada para el servicio de crear recetas
export interface CreateRecipeResponse {
    success: boolean;
    recipe?: Recipe;
    error?: string;
}