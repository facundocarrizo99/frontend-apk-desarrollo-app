import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AlertState } from '../utils/useAlert';

interface AlertModalProps {
    alertState: AlertState;
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    alertState,
    onConfirm,
    onCancel,
    onClose
}) => {
    const getTitleColor = () => {
        switch (alertState.type) {
            case 'error':
                return '#D32F2F';
            case 'success':
                return '#4C5F00';
            case 'confirm':
                return '#4C5F00';
            default:
                return '#333';
        }
    };

    const getIconName = () => {
        switch (alertState.type) {
            case 'error':
                return 'alert-circle-outline';
            case 'success':
                return 'checkmark-circle-outline';
            case 'confirm':
                return 'help-circle-outline';
            default:
                return 'information-circle-outline';
        }
    };

    return (
        <Modal
            transparent
            visible={alertState.visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <View style={styles.titleContainer}>
                            <Ionicons 
                                name={getIconName()} 
                                size={24} 
                                color={getTitleColor()} 
                                style={styles.titleIcon}
                            />
                            <Text style={[styles.modalTitle, { color: getTitleColor() }]}>
                                {alertState.title}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.modalMessage}>
                        {alertState.message}
                    </Text>

                    <View style={styles.buttonContainer}>
                        {alertState.showCancel && (
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={onCancel}
                            >
                                <Text style={styles.cancelButtonText}>
                                    {alertState.cancelText}
                                </Text>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity
                            style={[
                                styles.modalButton, 
                                styles.confirmButton,
                                { backgroundColor: getTitleColor() }
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>
                                {alertState.confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        width: '85%',
        minWidth: 280,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleIcon: {
        marginRight: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalMessage: {
        fontSize: 16,
        color: '#333',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    confirmButton: {
        backgroundColor: '#4C5F00',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 