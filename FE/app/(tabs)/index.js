import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View, ImageBackground } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    IconButton,
    Portal,
    Provider as PaperProvider,
    Snackbar,
    Text,
    TextInput
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';
import Constants from 'expo-constants';

const InventoryManagementScreen = () => {
    const { todos, fetchTodos } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both item name and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
            setSnackbarMessage('Item added successfully!');
            setSnackbarVisible(true);
        } catch (error) {
            setDialogMessage('Failed to add item');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id) => { // Perhatikan bahwa tipe data tidak lagi didefinisikan
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete item');
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ImageBackground source={require('../../assets/images/background1.jpg')} style={styles.background}>
                <ThemedView style={styles.container}>
                    <ThemedText style={styles.title} type="title">INVENTORY MANAGEMENT</ThemedText>
                    {todos.length === 0 && (
                        <Text style={styles.subtitle}>Easily manage your inventory items!</Text>
                    )}
                    {loading ? (
                        <ActivityIndicator style={styles.loading} animating={true} />
                    ) : (
                        <FlatList
                            data={todos}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Card style={styles.card} elevation={3}>
                                    <Card.Content>
                                        <View style={styles.cardHeader}>
                                            <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                                            <Text style={styles.stockLabel}>#</Text>
                                        </View>
                                        <View style={styles.separator} />
                                        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
                                    </Card.Content>
                                    <Card.Actions style={styles.cardActions}>
                                        <IconButton
                                            icon="pencil"
                                            size={24}
                                            onPress={() => router.push(`../todo/${item._id}`)}
                                            style={styles.iconButton}
                                        />
                                        <IconButton
                                            icon="delete-outline"
                                            size={24}
                                            onPress={() => handleDeleteTodo(item._id)}
                                            style={styles.iconButton}
                                        />
                                    </Card.Actions>
                                </Card>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                    {isAdding && (
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
                            <TextInput label="Item Name" value={title} onChangeText={setTitle} style={styles.input} mode="outlined" />
                            <TextInput label="Description" value={description} onChangeText={setDescription} style={styles.input} mode="outlined" multiline />
                            <Button mode="contained" onPress={handleAddTodo} style={styles.addButton}>Add Item</Button>
                            <Button onPress={() => setIsAdding(false)} style={styles.cancelButton}>Cancel</Button>
                        </KeyboardAvoidingView>
                    )}
                    {!isAdding && (
                        <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} label="" />
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title>Alert</Dialog.Title>
                            <Dialog.Content>
                                <Text>{dialogMessage}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        duration={3000}
                        action={{
                            label: 'Close',
                            onPress: () => {
                                setSnackbarVisible(false);
                            },
                        }}
                    >
                        {snackbarMessage}
                    </Snackbar>
                </ThemedView>
            </ImageBackground>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'rgba(254, 254, 254, 0.7)',
        borderRadius: 12,
        margin: 16,
    },
    title: {
        marginTop: 16,
        marginHorizontal: 16,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2A9D8F',
        textAlign: 'center',
        textTransform: 'uppercase',
        paddingVertical: 10,
        backgroundColor: '#E8F6F3',
        borderRadius: 12,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
        marginTop: 200,
        marginBottom: 16,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontWeight: 'bold',
        color: '#333',
    },
    stockLabel: {
        fontSize: 14,
        color: '#2A9D8F',
        fontWeight: 'bold',
    },
    description: {
        marginTop: 8,
        color: '#666',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#2A9D8F',
    },
    inputContainer: {
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'absolute',
        top: '30%',
        left: 0,
        right: 0,
        marginHorizontal: 16,
    },
    input: {
        marginBottom: 12,
    },
    addButton: {
        marginTop: 12,
        backgroundColor: '#2A9D8F',
    },
    cancelButton: {
        marginTop: 8,
        color: '#2A9D8F',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconButton: {
        backgroundColor: '#2A9D8F',
        borderRadius: 32,
        padding: 8,
        marginHorizontal: 4,
        elevation: 3,
    },
});

export default InventoryManagementScreen;
