import { useState } from 'react';

interface AlertOptions {
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
}

export interface AlertState {
    visible: boolean;
    type: 'error' | 'success' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel: boolean;
    confirmText: string;
    cancelText: string;
}

export const useAlert = () => {
    const [alertState, setAlertState] = useState<AlertState>({
        visible: false,
        type: 'error',
        title: '',
        message: '',
        showCancel: false,
        confirmText: 'OK',
        cancelText: 'Cancelar'
    });

    const showError = (message: string, onConfirm?: () => void) => {
        setAlertState({
            visible: true,
            type: 'error',
            title: 'Error',
            message,
            onConfirm,
            showCancel: false,
            confirmText: 'OK',
            cancelText: 'Cancelar'
        });
    };

    const showSuccess = (message: string, onConfirm?: () => void) => {
        setAlertState({
            visible: true,
            type: 'success',
            title: 'Éxito',
            message,
            onConfirm,
            showCancel: false,
            confirmText: 'OK',
            cancelText: 'Cancelar'
        });
        
        // Si se proporciona callback y es un mensaje de éxito, auto-redirigir después de 2 segundos
        if (onConfirm) {
            setTimeout(() => {
                setAlertState(prev => ({ ...prev, visible: false }));
                onConfirm();
            }, 2000);
        }
    };

    const showConfirm = (options: AlertOptions) => {
        setAlertState({
            visible: true,
            type: 'confirm',
            title: options.title,
            message: options.message,
            onConfirm: options.onConfirm,
            onCancel: options.onCancel,
            showCancel: options.showCancel ?? true,
            confirmText: options.confirmText ?? 'OK',
            cancelText: options.cancelText ?? 'Cancelar'
        });
    };

    const hideAlert = () => {
        setAlertState(prev => ({ ...prev, visible: false }));
    };

    const handleConfirm = () => {
        if (alertState.onConfirm) {
            alertState.onConfirm();
        }
        hideAlert();
    };

    const handleCancel = () => {
        if (alertState.onCancel) {
            alertState.onCancel();
        }
        hideAlert();
    };

    return {
        alertState,
        showError,
        showSuccess,
        showConfirm,
        hideAlert,
        handleConfirm,
        handleCancel
    };
}; 