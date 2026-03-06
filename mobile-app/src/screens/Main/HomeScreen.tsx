import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, TextInput, StatusBar } from 'react-native';
import client from '../../api/client';
import { useAuth } from '../../hooks/use-auth';
import { Bell, Search, MapPin } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            const [catRes, serRes] = await Promise.all([
                client.get('/categories'),
                client.get('/services')
            ]);

            const allCategory = { id: 'all', name: 'All', icon_url: null };
            setCategories([allCategory, ...catRes.data]);

            const activeServices = serRes.data.filter((s: any) => s.is_active);
            setServices(activeServices);
            setFilteredServices(activeServices);

            const countRes = await client.get('/notifications/unread-count');
            setUnreadCount(countRes.data.count || 0);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        let filtered = services;

        if (selectedCategoryId !== 'all') {
            filtered = filtered.filter((s: any) => s.category_id === selectedCategoryId);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter((s: any) =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.Category?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredServices(filtered);
    }, [selectedCategoryId, services, searchQuery]);

    return (
        <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <View style={styles.profileSection}>
                        <View style={styles.avatarPlaceholder}>
                            {user?.profile_picture ? (
                                <Image source={{ uri: user.profile_picture }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                            )}
                        </View>
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeBackText}>Welcome back,</Text>
                            <Text style={styles.userNameText}>{user?.name || 'User'}</Text>
                        </View>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.notificationButton}
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <Bell size={22} color="#111827" />
                            {unreadCount > 0 ? (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCount}</Text>
                                </View>
                            ) : null}
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.headerTitle}>What service do you{"\n"}<Text style={styles.headerTitleAccent}>need today?</Text></Text>

                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for services..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    contentContainerStyle={styles.categoriesList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryItem,
                                selectedCategoryId === item.id ? styles.selectedCategoryItem : null
                            ]}
                            onPress={() => setSelectedCategoryId(item.id)}
                        >
                            <View style={[
                                styles.categoryIconWrapper,
                                selectedCategoryId === item.id && styles.selectedCategoryIconWrapper
                            ]}>
                                {item.id === 'all' ? (
                                    <View style={styles.allCategoryIcon}>
                                        <Text style={[styles.allCategoryText, selectedCategoryId === 'all' ? styles.selectedAllCategoryText : null]}>ALL</Text>
                                    </View>
                                ) : item.icon_url ? (
                                    <Image source={{ uri: item.icon_url }} style={styles.categoryIconImage as any} />
                                ) : (
                                    <View style={styles.categoryIconPlaceholder} />
                                )}
                            </View>
                            <Text style={[
                                styles.categoryName,
                                selectedCategoryId === item.id && styles.selectedCategoryName
                            ]}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    {selectedCategoryId === 'all' ? 'Recommended Services' : `${categories.find(c => c.id === selectedCategoryId)?.name} Services`}
                </Text>
                {filteredServices.map((item) => (
                    <View
                        key={item.id}
                        style={styles.serviceItem}
                    >
                        <View style={styles.serviceInfo}>
                            <Text style={styles.serviceName}>{item.name}</Text>
                            <Text style={styles.serviceCategory}>{item.Category?.name}</Text>
                            <Text style={styles.servicePrice}>PKR {item.price}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={() => navigation.navigate('ServiceDetail', { service: item })}
                        >
                            <Text style={styles.bookButtonText}>Book</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingBottom: 30,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        zIndex: 10,
    },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    profileSection: { flexDirection: 'row', alignItems: 'center' },
    avatarPlaceholder: { width: 45, height: 45, borderRadius: 23, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 12, overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    avatarText: { color: '#0066FF', fontSize: 18, fontWeight: 'bold' },
    welcomeContainer: { justifyContent: 'center' },
    welcomeBackText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    userNameText: { fontSize: 16, color: '#111827', fontWeight: 'bold' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notificationButton: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', minWidth: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    headerTitle: { fontSize: 28, fontWeight: '900', color: '#111827', lineHeight: 36, marginBottom: 25 },
    headerTitleAccent: { color: '#0066FF' },
    searchContainer: { width: '100%' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 15, borderRadius: 18, gap: 10, height: 55 },
    searchInput: { flex: 1, color: '#111827', fontSize: 15, fontWeight: '500' },
    section: { paddingVertical: 20, paddingHorizontal: 25 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 20 },
    categoriesList: { paddingRight: 25, paddingLeft: 5, paddingVertical: 5 },
    categoryItem: { alignItems: 'center', marginRight: 22 },
    selectedCategoryItem: { transform: [{ scale: 1.05 }] },
    categoryIconWrapper: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#fff', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    selectedCategoryIconWrapper: { borderColor: '#0066FF', backgroundColor: '#E0F2FE', borderWidth: 3 },
    categoryIconImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    categoryIconPlaceholder: { width: '100%', height: '100%', backgroundColor: '#F3F4F6' },
    allCategoryIcon: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
    allCategoryText: { fontSize: 14, fontWeight: 'bold', color: '#9CA3AF' },
    selectedAllCategoryText: { color: '#0066FF' },
    categoryName: { fontSize: 12, marginTop: 10, color: '#6B7280', fontWeight: '600' },
    selectedCategoryName: { color: '#111827', fontWeight: 'bold' },
    serviceItem: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
    },
    serviceInfo: { flex: 1 },
    serviceName: { fontSize: 17, fontWeight: '700', color: '#111827' },
    serviceCategory: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' },
    servicePrice: { fontSize: 16, fontWeight: '800', color: '#0066FF', marginTop: 8 },
    bookButton: { backgroundColor: '#0066FF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, elevation: 2 },
    bookButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
