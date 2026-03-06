import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../../hooks/use-auth';

export default function LoginScreen({ navigation, route }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login } = useAuth();

    React.useEffect(() => {
        if (route.params?.successMessage) {
            setSuccess(route.params.successMessage);
        }
    }, [route.params?.successMessage]);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await login(email, password);
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
                <Text style={styles.tagline}>Quality services at your doorstep</Text>
            </View>

            <View style={styles.formContainer}>
                {success ? <Text style={styles.successText}>{success}</Text> : null}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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
    successText: { color: '#10B981', marginBottom: 15, textAlign: 'center', fontWeight: '500' },
    linkButton: { marginTop: 20, alignItems: 'center' },
    linkText: { color: '#0066FF', fontSize: 14, fontWeight: '500' },
});
