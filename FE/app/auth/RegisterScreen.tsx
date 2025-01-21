import React, { useState } from "react";  
import { StyleSheet, Text, TextInput, TouchableOpacity, ImageBackground } from "react-native";  
import { useRouter } from "expo-router";  
import axios from "axios";  
import { ThemedView } from "@/components/ThemedView";  
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";  
import API_URL from "../../config/config";  

export default function RegisterScreen() {  
    const [username, setUsername] = useState("");  
    const [password, setPassword] = useState("");  
    const [email, setEmail] = useState("");  
    const [dialogVisible, setDialogVisible] = useState(false);  
    const [dialogMessage, setDialogMessage] = useState("");  
    const router = useRouter();  

    const handleRegister = async () => {  
        try {  
            await axios.post(`${API_URL}/api/auth/register`, { username, password, email });  
            router.replace("/auth/LoginScreen");  
        } catch (error) {  
            const errorMessage = (error as any).response?.data?.message || "An error occurred";  
            setDialogMessage(errorMessage);  
            setDialogVisible(true);  
        }  
    };  

    return (  
        <PaperProvider>  
            <ImageBackground source={require("../../assets/images/background2.jpg")} style={styles.background}>  
                <ThemedView style={styles.container}>  
                    <Text style={styles.title}>Create an Account</Text>  
                    <Text style={styles.subtitle}>Join us and get started</Text>  
                    <TextInput  
                        style={styles.input}  
                        placeholder="Username"  
                        value={username}  
                        onChangeText={setUsername}  
                        autoCapitalize="none"  
                    />  
                    <TextInput  
                        style={styles.input}  
                        placeholder="Email"  
                        value={email}  
                        onChangeText={setEmail}  
                        keyboardType="email-address"  
                        autoCapitalize="none"  
                    />  
                    <TextInput  
                        style={styles.input}  
                        placeholder="Password"  
                        value={password}  
                        onChangeText={setPassword}  
                        secureTextEntry  
                    />  
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>  
                        <Text style={styles.registerButtonText}>Register</Text>  
                    </TouchableOpacity>  
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/LoginScreen")}>  
                        <Text style={styles.loginButtonText}>Login</Text>  
                    </TouchableOpacity>  
                    <Portal>  
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>  
                            <Dialog.Title>Registration Failed</Dialog.Title>  
                            <Dialog.Content>  
                                <Text>{dialogMessage}</Text>  
                            </Dialog.Content>  
                            <Dialog.Actions>  
                                <Button onPress={() => setDialogVisible(false)}>OK</Button>  
                            </Dialog.Actions>  
                        </Dialog>  
                    </Portal>  
                </ThemedView>  
            </ImageBackground>  
        </PaperProvider>  
    );  
}  

const styles = StyleSheet.create({  
    background: {  
        flex: 1,  
        resizeMode: "cover",    
        justifyContent: "center",  
        alignItems: "center",  
    },  
    container: {  
        flex: 1,  
        justifyContent: "center",  
        alignItems: "center",  
        padding: 16,  
        backgroundColor: "rgba(255, 228, 225, 0.8)", 
        width: "100%",  
        height: "100%",  
    },  
    title: {  
        fontSize: 28,  
        fontWeight: "bold",  
        marginBottom: 8,  
        color: "#283593",    
    },  
    subtitle: {  
        fontSize: 16,  
        color: "#4F83CC",    
        marginBottom: 24,  
    },  
    input: {  
        width: "100%",  
        height: 48,  
        borderColor: "#d6336c",    
        borderWidth: 1,  
        borderRadius: 8,  
        paddingHorizontal: 12,  
        marginBottom: 16,  
        backgroundColor: "#fff",  
        shadowColor: "#000",  
        shadowOffset: {  
            width: 0,  
            height: 1,  
        },  
        shadowOpacity: 0.2,  
        shadowRadius: 1.41,  
        elevation: 2,  
    },  
    registerButton: {  
        width: "100%",  
        height: 48,  
        backgroundColor: "#3B8DFF",   
        borderRadius: 8,  
        justifyContent: "center",  
        alignItems: "center",  
        marginBottom: 16,  
        elevation: 2,  
    },  
    registerButtonText: {  
        color: "#fff",  
        fontSize: 16,  
        fontWeight: "600",  
    },  
    loginButton: {  
        width: "100%",  
        height: 48,  
        borderWidth: 1,  
        borderColor: "#3B8DFF",  
        borderRadius: 8,  
        justifyContent: "center",  
        alignItems: "center",  
    },  
    loginButtonText: {  
        color: "#3B8DFF",  
        fontSize: 16,  
        fontWeight: "600",  
    },  
});
