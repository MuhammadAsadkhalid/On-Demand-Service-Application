import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Home, Calendar, User } from 'lucide-react-native';

// Auth
import { AuthProvider, useAuth } from './src/hooks/use-auth';

// Auth Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignUpScreen';

// Main Screens
import HomeScreen from './src/screens/Main/HomeScreen';
import ServiceDetailScreen from './src/screens/Main/ServiceDetailScreen';
import BookingsScreen from './src/screens/Main/BookingsScreen';
import ProfileScreen from './src/screens/Main/ProfileScreen';
import EditProfileScreen from './src/screens/Main/EditProfileScreen';
import NotificationsScreen from './src/screens/Main/NotificationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator id="homeStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator id="profileStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileHome" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
    );
}

function TabNavigator() {
    return (
        <Tab.Navigator
            id="tab"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'HomeTab') return <Home color={color} size={size} />;
                    if (route.name === 'Bookings') return <Calendar color={color} size={size} />;
                    if (route.name === 'Profile') return <User color={color} size={size} />;
                },
                tabBarActiveTintColor: '#0066FF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
            <Tab.Screen name="Bookings" component={BookingsScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}

function AuthNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View id="loading-view" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator id="root" screenOptions={{ headerShown: false }}>
                {!user ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Main" component={TabNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AuthNavigator />
        </AuthProvider>
    );
}
