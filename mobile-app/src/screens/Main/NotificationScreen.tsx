import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bell, CheckCircle2, XCircle, Info, ChevronLeft } from 'lucide-react-native';
import client from '../../api/client';

export default function NotificationsScreen({ navigation }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await client.get('/notifications');
            setNotifications(res.data);

            // Mark all as read when opening screen
            res.data.filter(n => !n.is_read).forEach(async n => {
                await client.put(`/notifications/${n.id}/read`);
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (title) => {
        if (title.includes('Accepted')) return <CheckCircle2 size={24} color="#16A34A" />;
        if (title.includes('Rejected')) return <XCircle size={24} color="#DC2626" />;
        return <Info size={24} color="#0066FF" />;
    };

    if (loading) return <View style={styles.center}><ActivityIndicator color="#0066FF" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
            </View>

            {notifications.length === 0 ? (
                <View style={styles.center}>
                    <Bell size={48} color="#E5E7EB" />
                    <Text style={styles.emptyText}>No notifications yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    contentContainerStyle={{ padding: 20 }}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.notificationCard, !item.is_read && styles.unreadCard]}>
                            <View style={styles.iconContainer}>
                                {getIcon(item.title)}
                            </View>
                            <View style={styles.content}>
                                <Text style={styles.notifTitle}>{item.title}</Text>
                                <Text style={styles.notifMessage}>{item.message}</Text>
                                <Text style={styles.notifTime}>{new Date(item.createdAt).toLocaleString()}</Text>
                            </View>
                            {!item.is_read && <View style={styles.unreadDot} />}
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 25, paddingTop: 50, backgroundColor: '#fff', gap: 15 },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
    emptyText: { fontSize: 16, color: '#9CA3AF', marginTop: 10 },
    notificationCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
    unreadCard: { borderColor: '#DBEAFE', backgroundColor: '#F8FAFC' },
    iconContainer: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    content: { flex: 1 },
    notifTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
    notifMessage: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
    notifTime: { fontSize: 11, color: '#9CA3AF', marginTop: 8 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0066FF', marginTop: 10 }
});
