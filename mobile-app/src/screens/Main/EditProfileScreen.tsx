import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../hooks/use-auth';
import { Camera, Mail, User, Phone, MapPin, Lock, Check, ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import client from '../../api/client';

/**
 * EditProfileScreen - Screen for users to edit their profile information and change password.
 */
export default function EditProfileScreen({ navigation, route }) {
    const { user, updateProfile } = useAuth();
    const focusPassword = route.params?.focusPassword;

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [profilePicture, setProfilePicture] = useState(user?.profile_picture || null);

    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    useEffect(() => {
        if (focusPassword) {
            // In a real app we might scroll to password section
        }
    }, [focusPassword]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setProfilePicture(base64Image);
        }
    };

    const handleUpdateProfile = async () => {
        if (!name || !email) {
            Alert.alert('Error', 'Name and Email are required.');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                address: address.trim(),
                profile_picture: profilePicture
            });
            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            Alert.alert('Error', 'Please fill all password fields.');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await client.post('/auth/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            Alert.alert('Success', 'Password updated successfully!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (key: string) => {
        setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleUpdateProfile} disabled={loading} style={styles.saveHeaderButton}>
                        {loading ? <ActivityIndicator size="small" color="#0066FF" /> : <Text style={styles.saveHeaderText}>Save</Text>}
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {profilePicture ? (
                                <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <User size={40} color="#fff" />
                                </View>
                            )}
                            <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                                <Camera size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.avatarLabel}>Tap camera icon to change photo</Text>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Basic Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your full name"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    placeholder="your@email.com"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <View style={styles.inputWrapper}>
                                <Phone size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholder="+92 000 0000000"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Address</Text>
                            <View style={styles.inputWrapper}>
                                <MapPin size={20} color="#9CA3AF" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="123 Street, City, Country"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Security Settings</Text>

                        <View style={styles.passwordCard}>
                            <Text style={styles.passwordTitle}>Change Password</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Current Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={passwords.current}
                                        onChangeText={(v) => setPasswords({ ...passwords, current: v })}
                                        secureTextEntry={!showPasswords.current}
                                        placeholder="Enter current password"
                                    />
                                    <TouchableOpacity onPress={() => togglePasswordVisibility('current')}>
                                        {showPasswords.current ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>New Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={passwords.new}
                                        onChangeText={(v) => setPasswords({ ...passwords, new: v })}
                                        secureTextEntry={!showPasswords.new}
                                        placeholder="Enter new password"
                                    />
                                    <TouchableOpacity onPress={() => togglePasswordVisibility('new')}>
                                        {showPasswords.new ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Confirm New Password</Text>
                                <View style={styles.inputWrapper}>
                                    <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={passwords.confirm}
                                        onChangeText={(v) => setPasswords({ ...passwords, confirm: v })}
                                        secureTextEntry={!showPasswords.confirm}
                                        placeholder="Confirm new password"
                                    />
                                    <TouchableOpacity onPress={() => togglePasswordVisibility('confirm')}>
                                        {showPasswords.confirm ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.updatePasswordButton}
                                onPress={handleUpdatePassword}
                                disabled={loading}
                            >
                                <Text style={styles.updatePasswordText}>Update Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleUpdateProfile}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <Check size={20} color="#fff" />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    backButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    saveHeaderButton: { minWidth: 50, alignItems: 'flex-end' },
    saveHeaderText: { fontSize: 16, fontWeight: 'bold', color: '#0066FF' },
    content: { padding: 25 },
    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatarContainer: { position: 'relative' },
    avatarImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#fff' },
    avatarPlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#0066FF', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
    cameraButton: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#0066FF', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
    avatarLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 12, fontWeight: '500' },
    formSection: { marginBottom: 30 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 15, marginLeft: 5 },
    inputGroup: { marginBottom: 20 },
    inputLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 8, marginLeft: 5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#E5E7EB' },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, color: '#111827', fontSize: 15, fontWeight: '500' },
    passwordCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
    passwordTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 18 },
    updatePasswordButton: { backgroundColor: '#F5F3FF', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    updatePasswordText: { color: '#7C3AED', fontWeight: 'bold', fontSize: 14 },
    saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0066FF', padding: 18, borderRadius: 20, gap: 10, elevation: 4, shadowColor: '#0066FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
