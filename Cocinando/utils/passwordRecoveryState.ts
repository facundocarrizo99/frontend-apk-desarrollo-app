/**
 * Sistema simple de gestión de estado para el flujo de recuperación de contraseña
 * Permite compartir el email entre las pantallas del flujo
 */
interface PasswordRecoveryState {
    email: string;
    code: string;
    isCodeVerified: boolean;
}

class PasswordRecoveryStateManager {
    private static instance: PasswordRecoveryStateManager;
    private state: PasswordRecoveryState = {
        email: '',
        code: '',
        isCodeVerified: false
    };

    private constructor() {}

    static getInstance(): PasswordRecoveryStateManager {
        if (!PasswordRecoveryStateManager.instance) {
            PasswordRecoveryStateManager.instance = new PasswordRecoveryStateManager();
        }
        return PasswordRecoveryStateManager.instance;
    }

    // Métodos para el email
    setEmail(email: string): void {
        this.state.email = email;
    }

    getEmail(): string {
        return this.state.email;
    }

    // Métodos para el código
    setCode(code: string): void {
        this.state.code = code;
    }

    getCode(): string {
        return this.state.code;
    }

    // Métodos para la verificación del código
    setCodeVerified(verified: boolean): void {
        this.state.isCodeVerified = verified;
    }

    isCodeVerified(): boolean {
        return this.state.isCodeVerified;
    }

    // Obtener todo el estado
    getState(): PasswordRecoveryState {
        return { ...this.state };
    }

    // Limpiar el estado
    clear(): void {
        this.state = {
            email: '',
            code: '',
            isCodeVerified: false
        };
    }

    // Validar si el flujo está completo
    isFlowComplete(): boolean {
        return this.state.email !== '' && this.state.code !== '' && this.state.isCodeVerified;
    }
}

// Exportar la instancia singleton
export const passwordRecoveryState = PasswordRecoveryStateManager.getInstance(); 