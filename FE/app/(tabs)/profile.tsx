import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text } from 'react-native-paper';
import API_URL from '@/config/config';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <ImageBackground source={require('../../assets/images/background1.jpg')} style={styles.background}>
                    <ThemedView style={styles.container}>
                        <ActivityIndicator animating={true} color="#6200ee" />
                    </ThemedView>
                </ImageBackground>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ImageBackground source={require('../../assets/images/background1.jpg')} style={styles.background}>
                <ThemedView style={styles.container}>
                    {profile ? (
                        <View style={styles.profileContainer}>
                            <View style={styles.header}>
                                {/* Profile Icon with the specified green color */}
                                <Icon name="account-circle" size={80} color="#4A90E2" style={styles.profileIcon} />
                                <ThemedText style={styles.title}>Profile</ThemedText>
                            </View>

                            <ThemedText style={styles.label}>Username:</ThemedText>
                            <ThemedText style={styles.value}>{profile.username}</ThemedText>
                            <View style={styles.separator} />

                            <ThemedText style={styles.label}>Email:</ThemedText>
                            <ThemedText style={styles.value}>{profile.email}</ThemedText>
                            <View style={styles.separator} />

                            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                                Log Out
                            </Button>
                        </View>
                    ) : (
                        <ThemedText style={styles.noDataText}>No profile data available</ThemedText>
                    )}

                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title style={styles.dialogTitle}>Logout</Dialog.Title>
                            <Dialog.Content>
                                <Text style={styles.dialogContent}>Are you sure you want to logout?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)} style={styles.dialogButton}>
                                    Cancel
                                </Button>
                                <Button onPress={confirmLogout} style={styles.dialogButton}>
                                    OK
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </ImageBackground>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(254, 254, 254, 0.4)',
    },
    profileContainer: {
        width: '90%',
        maxWidth: 400,
        padding: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(254, 254, 254, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileIcon: {
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4A90E2',  // Green color as requested
        textAlign: 'center',
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        color: '#333',
    },
    value: {
        fontSize: 18,
        color: '#555',
        marginBottom: 16,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    logoutButton: {
        marginTop: 24,
        backgroundColor: '#E53935',
        borderRadius: 10,
    },
    noDataText: {
        fontSize: 18,
        color: '#888',
        marginTop: 20,
    },
    dialogTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    dialogContent: {
        fontSize: 18,
        color: '#333',
    },
    dialogButton: {
        marginHorizontal: 8,
    },
});

export default ProfileScreen;
