import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const userStr = await AsyncStorage.getItem('user');
                if (token && userStr) {
                    setUser(JSON.parse(userStr));
                }
            } catch (e) {
                console.error('Failed to load storage data', e);
            } finally {
                setLoading(false);
            }
        };
        loadStorageData();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const normalizedEmail = email.trim().toLowerCase();
            console.log('Attempting login for:', normalizedEmail);
            console.log('API URL:', client.defaults.baseURL);
            const response = await client.post('/auth/login', { email: normalizedEmail, password: password.trim() });
            console.log('Login response status:', response.status);
            const { token, user } = response.data;
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } catch (error: any) {
            console.error('Login error detail:', error.response?.data || error.message);
            const message = error.response?.data?.message || 'Login failed. Please check your connection.';
            throw new Error(message);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const normalizedEmail = email.trim().toLowerCase();
            await client.post('/auth/register', {
                name: name.trim(),
                email: normalizedEmail,
                password: password.trim()
            });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            throw new Error(message);
        }
    };

    const updateProfile = async (data: any) => {
        try {
            const response = await client.put('/users/profile', data);
            const { user: updatedUser } = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
            throw new Error(message);
        }
    };

    const refreshUser = async () => {
        try {
            const response = await client.get('/users/profile');
            const updatedUser = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (error: any) {
            console.error('Failed to refresh user', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
