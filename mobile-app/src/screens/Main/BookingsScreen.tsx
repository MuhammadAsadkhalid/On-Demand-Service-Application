import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react-native';
import client from '../../api/client';
import { useFocusEffect } from '@react-navigation/native';

export default function BookingsScreen() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Pending');

    useFocusEffect(
        useCallback(() => {
            fetchBookings();
        }, [])
    );

    const fetchBookings = async () => {
        try {
            const response = await client.get('/bookings/my');
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        );
    }

    const filteredBookings = bookings.filter((b: any) => b.status === activeTab);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Bookings</Text>
            </View>

            <View style={styles.tabContainer}>
                {['Pending', 'Accepted', 'Rejected'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {filteredBookings.length === 0 ? (
                <View style={styles.center}>
                    <AlertCircle size={48} color="#9CA3AF" />
                    <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredBookings}
                    contentContainerStyle={{ padding: 20 }}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardMain}>
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceName}>{item.Service?.name || 'Service'}</Text>
                                    <Text style={styles.categoryName}>{item.Service?.Category?.name || 'Category'}</Text>
                                </View>
                                <Text style={styles.price}>PKR {item.total_price}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.cardFooter}>
                                <View style={styles.footerItem}>
                                    <Calendar size={14} color="#6B7280" />
                                    <Text style={styles.footerText}>{new Date(item.booking_date).toLocaleDateString()}</Text>
                                </View>
                                <View style={styles.footerItem}>
                                    <Clock size={14} color="#6B7280" />
                                    <Text style={styles.footerText}>{item.booking_time}</Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    item.status === 'Pending' ? styles.pendingBadge :
                                        item.status === 'Accepted' ? styles.acceptedBadge :
                                            styles.rejectedBadge
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        item.status === 'Pending' ? styles.pendingText :
                                            item.status === 'Accepted' ? styles.acceptedText :
                                                styles.rejectedText
                                    ]}>{item.status}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
    header: { padding: 25, paddingTop: 50, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: '900', color: '#111827' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 15 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#0066FF' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
    activeTabText: { color: '#0066FF' },
    emptyText: { fontSize: 16, color: '#9CA3AF', fontWeight: '500' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    serviceInfo: { flex: 1 },
    serviceName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    categoryName: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    price: { fontSize: 18, fontWeight: '900', color: '#0066FF' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    footerText: { fontSize: 12, color: '#6B7280' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginLeft: 'auto' },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    pendingBadge: { backgroundColor: '#FFF7ED' },
    pendingText: { color: '#EA580C' },
    acceptedBadge: { backgroundColor: '#F0FDF4' },
    acceptedText: { color: '#16A34A' },
    rejectedBadge: { backgroundColor: '#FEF2F2' },
    rejectedText: { color: '#DC2626' },
});
