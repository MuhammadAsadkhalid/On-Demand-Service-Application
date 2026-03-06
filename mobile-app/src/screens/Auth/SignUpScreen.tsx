import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../hooks/use-auth';

export default function SignUpScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await register(name, email, password);
            Alert.alert('Success', 'Sign up successful! Please log in.', [
                { text: 'OK', onPress: () => navigation.navigate('Login', { successMessage: 'Sign up successful! Please log in.' }) }
            ]);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Brand Spark</Text>
                <Text style={styles.tagline}>Create a new account</Text>
            </View>

            <View style={styles.formContainer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>Already have an account? Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 20 },
    logoContainer: { alignItems: 'center', marginBottom: 50 },
    logoText: { fontSize: 32, fontWeight: 'bold', color: '#0066FF' },
    tagline: { fontSize: 14, color: '#666', marginTop: 5 },
    formContainer: { width: '100%' },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#0066FF',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    errorText: { color: '#EF4444', marginBottom: 15, textAlign: 'center' },
    linkButton: { marginTop: 20, alignItems: 'center' },
    linkText: { color: '#0066FF', fontSize: 14, fontWeight: '500' },
});
