import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomTabBar from '../components/BottomTabBar';
import { useState } from 'react';

type ShoppingItem = {
    id: string;
    name: string;
    quantity: string;
    completed: boolean;
};

export default function ShoppingListScreen() {
    const [items, setItems] = useState<ShoppingItem[]>([
        { id: '1', name: 'Huevos', quantity: '6 unidades', completed: false },
        { id: '2', name: 'Leche', quantity: '1 litro', completed: true },
        { id: '3', name: 'Pan', quantity: '1 unidad', completed: false },
    ]);
    const [newItem, setNewItem] = useState('');
    const [newQuantity, setNewQuantity] = useState('');

    const toggleItem = (id: string) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const addItem = () => {
        if (newItem.trim() === '') return;
        
        const newItemObj: ShoppingItem = {
            id: Date.now().toString(),
            name: newItem.trim(),
            quantity: newQuantity.trim() || '1 unidad',
            completed: false,
        };
        
        setItems([...items, newItemObj]);
        setNewItem('');
        setNewQuantity('');
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <View style={styles.container}>
            {/*<Header title="Lista de Compras" />*/}
            
            <View style={styles.content}>
                {/* Add Item Form */}
                <View style={styles.addItemContainer}>
                    <TextInput
                        style={[styles.input, styles.itemInput]}
                        placeholder="Nuevo artículo"
                        value={newItem}
                        onChangeText={setNewItem}
                    />
                    <TextInput
                        style={[styles.input, styles.quantityInput]}
                        placeholder="Cant."
                        value={newQuantity}
                        onChangeText={setNewQuantity}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addItem}>
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Shopping List */}
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <TouchableOpacity 
                                style={styles.checkbox}
                                onPress={() => toggleItem(item.id)}
                            >
                                <Ionicons 
                                    name={item.completed ? 'checkbox' : 'square-outline'} 
                                    size={24} 
                                    color={item.completed ? '#4C5F00' : '#ccc'} 
                                />
                            </TouchableOpacity>
                            
                            <View style={styles.itemDetails}>
                                <Text 
                                    style={[
                                        styles.itemName,
                                        item.completed && styles.completedItem
                                    ]}
                                >
                                    {item.name}
                                </Text>
                                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.deleteButton}
                                onPress={() => removeItem(item.id)}
                            >
                                <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            
            <BottomTabBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    addItemContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
        fontSize: 16,
    },
    itemInput: {
        flex: 1,
        marginRight: 8,
    },
    quantityInput: {
        width: 80,
        marginRight: 8,
    },
    addButton: {
        backgroundColor: '#4C5F00',
        width: 50,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    checkbox: {
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    completedItem: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
    },
    deleteButton: {
        padding: 8,
    },
});
