import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import { useAuth } from '../../hooks/use-auth';
import { User, Mail, Phone, MapPin, Eye, Edit3, LogOut, ChevronRight, Lock } from 'lucide-react-native';

export default function ProfileScreen({ navigation }) {
    const { user, logout, refreshUser, loading } = useAuth();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshUser();
        setRefreshing(false);
    };

    if (loading && !user) return null;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Edit3 size={20} color="#0066FF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {user?.profile_picture ? (
                            <Image source={{ uri: user.profile_picture }} style={styles.avatarImage} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, user?.is_blocked && styles.blockedAvatar]}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                            </View>
                        )}
                        {!user?.is_blocked && (
                            <View style={styles.activeBadge} />
                        )}
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
                    <View style={styles.roleContainer}>
                        <Text style={styles.roleText}>{user?.Role?.name || 'Customer'}</Text>
                    </View>

                    <TouchableOpacity style={styles.headerLogoutButton} onPress={logout}>
                        <LogOut size={16} color="#EF4444" />
                        <Text style={styles.headerLogoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {user?.is_blocked && (
                <View style={styles.blockedBanner}>
                    <Text style={styles.blockedBannerTitle}>Account Restricted</Text>
                    <Text style={styles.blockedBannerText}>
                        Your account has been suspended by the administrator.
                        Please contact support for more information.
                    </Text>
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General Information</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                                <User size={20} color="#0066FF" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Full Name</Text>
                                <Text style={styles.infoValue}>{user?.name || 'Not provided'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                                <Mail size={20} color="#16A34A" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Email Address</Text>
                                <Text style={styles.infoValue}>{user?.email || 'Not provided'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#FEF3F2' }]}>
                                <Phone size={20} color="#DC2626" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Phone Number</Text>
                                <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                                <MapPin size={20} color="#EA580C" />
                            </View>
                            <View style={styles.infoText}>
                                <Text style={styles.infoLabel}>Address</Text>
                                <Text style={styles.infoValue}>{user?.address || 'Set your address'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.actionCard}>
                        <TouchableOpacity
                            style={styles.actionRow}
                            onPress={() => navigation.navigate('EditProfile', { focusPassword: true })}
                        >
                            <View style={styles.actionLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                                    <Lock size={20} color="#7C3AED" />
                                </View>
                                <Text style={styles.actionLabel}>Change Password</Text>
                            </View>
                            <ChevronRight size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        backgroundColor: '#fff',
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 25,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#111827' },
    editButton: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center' },
    profileSection: { alignItems: 'center' },
    avatarContainer: { position: 'relative', marginBottom: 15 },
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0066FF', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff', elevation: 5, shadowColor: '#0066FF', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10 },
    avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff' },
    blockedAvatar: { backgroundColor: '#9CA3AF' },
    avatarText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
    activeBadge: { position: 'absolute', bottom: 5, right: 5, width: 22, height: 22, borderRadius: 11, backgroundColor: '#22C55E', borderWidth: 4, borderColor: '#fff' },
    userName: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8 },
    roleContainer: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    roleText: { fontSize: 13, color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase' },
    blockedBanner: { marginHorizontal: 25, marginTop: 20, backgroundColor: '#FEF2F2', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2' },
    blockedBannerTitle: { color: '#B91C1C', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    blockedBannerText: { color: '#B91C1C', fontSize: 13, lineHeight: 18, opacity: 0.8 },
    content: { padding: 25 },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 15, marginLeft: 5 },
    infoCard: { backgroundColor: '#fff', borderRadius: 25, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    iconBox: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    infoText: { flex: 1 },
    infoLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
    infoValue: { fontSize: 15, color: '#111827', fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginLeft: 57 },
    actionCard: { backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
    actionLeft: { flexDirection: 'row', alignItems: 'center' },
    actionLabel: { fontSize: 15, fontWeight: '600', color: '#111827' },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', padding: 18, borderRadius: 20, gap: 10, marginTop: 10 },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },
    headerLogoutButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12, gap: 8, marginTop: 15 },
    headerLogoutText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
    versionText: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 30, marginBottom: 20 },
});
