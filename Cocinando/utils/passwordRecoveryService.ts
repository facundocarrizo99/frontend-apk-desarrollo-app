import { APP_CONFIG, devLog } from './config';

export interface PasswordRecoveryResponse {
    success: boolean;
    message?: string;
    error?: string;
    data?: any;
}

export interface ResetPasswordResponse extends PasswordRecoveryResponse {
    token?: string;
    refreshToken?: string;
    user?: any;
}

export class PasswordRecoveryService {
    private static baseUrl = APP_CONFIG.API_BASE_URL;

    /**
     * Enviar código de verificación al email
     * Endpoint: POST /api/auth/forgot-password
     */
    static async sendVerificationCode(email: string): Promise<PasswordRecoveryResponse> {
        try {
            devLog('Enviando código de verificación', { email });
            
            const response = await fetch(`${this.baseUrl}${APP_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            devLog('Respuesta envío código', data);

            if (response.ok && data.status === 'success') {
                return {
                    success: true,
                    message: data.message || 'Código de verificación enviado al email!',
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Error al enviar el código de verificación',
                    data: data
                };
            }
        } catch (error) {
            devLog('Error enviando código de verificación', error);
            return {
                success: false,
                error: 'Error de conexión. Verifica tu internet.',
            };
        }
    }

    /**
     * Verificar código de verificación
     * Endpoint: POST /api/auth/verify-reset-code
     */
    static async verifyResetCode(email: string, code: string): Promise<PasswordRecoveryResponse> {
        try {
            devLog('Verificando código de verificación', { email, code });
            
            const response = await fetch(`${this.baseUrl}${APP_CONFIG.ENDPOINTS.VERIFY_RESET_CODE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();
            devLog('Respuesta verificación código', data);

            if (response.ok && data.status === 'success') {
                return {
                    success: true,
                    message: data.message || 'Código de verificación válido',
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Código de verificación inválido o expirado',
                    data: data
                };
            }
        } catch (error) {
            devLog('Error verificando código', error);
            return {
                success: false,
                error: 'Error de conexión. Verifica tu internet.',
            };
        }
    }

    /**
     * Cambiar contraseña
     * Endpoint: POST /api/auth/reset-password
     */
    static async resetPassword(
        email: string, 
        code: string, 
        password: string, 
        passwordConfirm: string
    ): Promise<ResetPasswordResponse> {
        try {
            devLog('Cambiando contraseña', { email, code });
            
            const response = await fetch(`${this.baseUrl}${APP_CONFIG.ENDPOINTS.RESET_PASSWORD}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    code, 
                    password, 
                    passwordConfirm 
                }),
            });

            const data = await response.json();
            devLog('Respuesta cambio contraseña', data);

            if (response.ok && data.status === 'success') {
                return {
                    success: true,
                    message: data.message || 'Contraseña actualizada correctamente',
                    token: data.token,
                    refreshToken: data.refreshToken,
                    user: data.data?.user,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'Error al actualizar la contraseña',
                    data: data
                };
            }
        } catch (error) {
            devLog('Error cambiando contraseña', error);
            return {
                success: false,
                error: 'Error de conexión. Verifica tu internet.',
            };
        }
    }

    /**
     * Reenviar código de verificación
     */
    static async resendVerificationCode(email: string): Promise<PasswordRecoveryResponse> {
        // Reutilizamos el mismo endpoint que para enviar el código inicial
        return this.sendVerificationCode(email);
    }

    /**
     * Validar formato de email
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validar contraseña
     */
    static validatePassword(password: string): { isValid: boolean; message?: string } {
        if (!password || password.length < 8) {
            return {
                isValid: false,
                message: 'La contraseña debe tener al menos 8 caracteres'
            };
        }
        
        return { isValid: true };
    }

    /**
     * Validar código de verificación
     */
    static validateVerificationCode(code: string): { isValid: boolean; message?: string } {
        if (!code || code.length !== 6) {
            return {
                isValid: false,
                message: 'El código debe tener 6 dígitos'
            };
        }
        
        if (!/^\d{6}$/.test(code)) {
            return {
                isValid: false,
                message: 'El código debe contener solo números'
            };
        }
        
        return { isValid: true };
    }
} 