import {
    CommentActionResponse,
    CommentResponse,
    CommentsApiResponse,
    CreateCommentApiResponse,
    CreateCommentRequest,
    PendingCommentsApiResponse
} from '../types/Recipie';
import { APP_CONFIG, devLog } from './config';
import { UserManager } from './userManager';

export const CommentsService = {
    // Obtener comentarios aprobados por receta
    getCommentsByRecipe: async (recetaId: string): Promise<CommentResponse> => {
        try {
            const token = UserManager.getAuthToken();
            
            if (!token) {
                devLog('No hay token de autenticación disponible para obtener comentarios');
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const url = `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.COMMENTS_BY_RECIPE.replace(':recetaId', recetaId)}`;
            devLog('Obteniendo comentarios por receta', { recetaId, url });
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data: CommentsApiResponse = await response.json();
            
            devLog('Respuesta de API obtener comentarios por receta:', data);

            if (response.ok && data.status === 'success') {
                return {
                    success: true,
                    comments: data.data.comentarios || []
                };
            } else {
                devLog('Error en la respuesta de la API de obtener comentarios por receta');
                return {
                    success: false,
                    error: data.message || 'Error al obtener comentarios',
                    comments: []
                };
            }
        } catch (error) {
            console.error('Error al obtener comentarios por receta:', error);
            devLog('Error de conexión al obtener comentarios por receta', error);
            
            return {
                success: false,
                error: 'Error de conexión al obtener comentarios',
                comments: []
            };
        }
    },

    // Crear comentario
    createComment: async (commentData: CreateCommentRequest): Promise<CommentResponse> => {
        try {
            const token = UserManager.getAuthToken();
            
            if (!token) {
                devLog('No hay token de autenticación disponible para crear comentario');
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            devLog('Creando comentario', commentData);
            
            const response = await fetch(`${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.COMMENTS_CREATE}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            const data: CreateCommentApiResponse = await response.json();
            
            devLog('Respuesta de API crear comentario:', data);

            if (response.ok && data.status === 'success') {
                return {
                    success: true,
                    comment: data.data?.comentario
                };
            } else {
                devLog('Error en la respuesta de la API de crear comentario');
                return {
                    success: false,
                    error: data.message || 'Error al crear comentario'
                };
            }
        } catch (error) {
            console.error('Error al crear comentario:', error);
            devLog('Error de conexión al crear comentario', error);
            
            return {
                success: false,
                error: 'Error de conexión al crear comentario'
            };
        }
    },

    // Obtener comentarios pendientes (Admin)
    getPendingComments: async (page: number = 1, limit: number = 10): Promise<CommentResponse> => {
        try {
            const token = UserManager.getAuthToken();
            
            if (!token) {
                devLog('No hay token de autenticación disponible para obtener comentarios pendientes');
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const url = `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.COMMENTS_PENDING}?page=${page}&limit=${limit}`;
            devLog('Obteniendo comentarios pendientes', { page, limit, url });
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data: PendingCommentsApiResponse = await response.json();
            
            devLog('Respuesta de API obtener comentarios pendientes:', data);

            if (response.ok && data.status === 'success') {
                return {
                    success: true,
                    comments: data.data.comentarios || [],
                    totalPages: data.totalPages,
                    currentPage: data.currentPage
                };
            } else {
                devLog('Error en la respuesta de la API de obtener comentarios pendientes');
                return {
                    success: false,
                    error: data.message || 'Error al obtener comentarios pendientes',
                    comments: []
                };
            }
        } catch (error) {
            console.error('Error al obtener comentarios pendientes:', error);
            devLog('Error de conexión al obtener comentarios pendientes', error);
            
            return {
                success: false,
                error: 'Error de conexión al obtener comentarios pendientes',
                comments: []
            };
        }
    },

    // Aprobar comentario (Admin)
    approveComment: async (commentId: string): Promise<CommentResponse> => {
        try {
            const token = UserManager.getAuthToken();
            
            if (!token) {
                devLog('No hay token de autenticación disponible para aprobar comentario');
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const url = `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.COMMENTS_APPROVE.replace(':id', commentId)}`;
            devLog('Aprobando comentario', { commentId, url });
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data: CommentActionResponse = await response.json();
            
            devLog('Respuesta de API aprobar comentario:', data);

            if (response.ok && data.status === 'success') {
                return {
                    success: true
                };
            } else {
                devLog('Error en la respuesta de la API de aprobar comentario');
                return {
                    success: false,
                    error: data.message || 'Error al aprobar comentario'
                };
            }
        } catch (error) {
            console.error('Error al aprobar comentario:', error);
            devLog('Error de conexión al aprobar comentario', error);
            
            return {
                success: false,
                error: 'Error de conexión al aprobar comentario'
            };
        }
    },

    // Eliminar comentario (Admin)
    deleteComment: async (commentId: string): Promise<CommentResponse> => {
        try {
            const token = UserManager.getAuthToken();
            
            if (!token) {
                devLog('No hay token de autenticación disponible para eliminar comentario');
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const url = `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.COMMENTS_DELETE.replace(':id', commentId)}`;
            devLog('Eliminando comentario', { commentId, url });
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data: CommentActionResponse = await response.json();
            
            devLog('Respuesta de API eliminar comentario:', data);

            if (response.ok && data.status === 'success') {
                return {
                    success: true
                };
            } else {
                devLog('Error en la respuesta de la API de eliminar comentario');
                return {
                    success: false,
                    error: data.message || 'Error al eliminar comentario'
                };
            }
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            devLog('Error de conexión al eliminar comentario', error);
            
            return {
                success: false,
                error: 'Error de conexión al eliminar comentario'
            };
        }
    }
}; 