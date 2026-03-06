import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use the exact local IP address from ipconfig so physical devices on the same Wi-Fi can connect
const API_URL = 'http://192.168.0.108:5000/api';

const client = axios.create({
    baseURL: API_URL,
});

client.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
