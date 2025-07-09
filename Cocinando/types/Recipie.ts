// Cocinando/types/Recipe.ts

// Interface para ingredientes
export interface Ingredient {
    _id: string;
    ingrediente: string;
    cantidad: number;
    unidadMedida: string;
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