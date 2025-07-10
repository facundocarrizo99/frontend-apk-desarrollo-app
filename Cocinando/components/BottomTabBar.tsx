import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomTabBar() {
    const [infoVisible, setInfoVisible] = useState<boolean>(false);
    const [infoMessage, setInfoMessage] = useState<string>('');

    const showInfo = (message: string) => {
        setInfoMessage(message);
        setInfoVisible(true);
    };

    const handleNavigation = (route: string) => {
        switch (route) {
            case 'inicio':
                router.push('/homeScreen');
                break;
            case 'buscar':
                router.push('/buscarReceta');
                break;
            case 'añadir':
                router.push('/crearReceta');
                break;
            case 'favoritos':
                router.push('/favoritos');
                break;
            case 'perfil':
                router.push('/perfil');
                break;
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Tab 
                    icon="home" 
                    label="Inicio" 
                    onPress={() => handleNavigation('inicio')}
                />
                <Tab 
                    icon="search" 
                    label="Buscar" 
                    onPress={() => handleNavigation('buscar')}
                />
                <Tab 
                    icon="add" 
                    label="Añadir" 
                    onPress={() => handleNavigation('añadir')}
                />
                <Tab 
                    icon="heart" 
                    label="Favoritos" 
                    onPress={() => handleNavigation('favoritos')}
                />
                <Tab 
                    icon="person" 
                    label="Mi perfil" 
                    onPress={() => handleNavigation('perfil')}
                />
            </View>

            {/* Modal de información */}
            <Modal
                transparent
                visible={infoVisible}
                animationType="fade"
                onRequestClose={() => setInfoVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalIcon}>ℹ️</Text>
                        <Text style={styles.modalTitle}>Próximamente</Text>
                        <Text style={styles.modalText}>{infoMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setInfoVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Entendido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

function Tab({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.tab} onPress={onPress}>
            <Ionicons name={icon} size={20} color="#4C5F00" />
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8DC',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    tab: {
        alignItems: 'center',
        paddingVertical: 5,
    },
    label: {
        fontSize: 10,
        color: '#4C5F00',
        marginTop: 2,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#C4B04E',
        padding: 25,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalIcon: {
        fontSize: 28,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 14,
        color: '#1C1C1C',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
    },
    modalButton: {
        backgroundColor: '#4C5F00',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});