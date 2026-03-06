import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import client from '../../api/client';
import { useAuth } from '../../hooks/use-auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock, Star, Info } from 'lucide-react-native';

export default function ServiceDetailScreen({ route, navigation }) {
    const { service } = route.params;
    const { user } = useAuth();
    const [booking, setBooking] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const yyyy = selectedDate.getFullYear();
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            setBookingDate(`${yyyy}-${mm}-${dd}`);
            setDate(selectedDate);
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const hh = String(selectedTime.getHours()).padStart(2, '0');
            const mm = String(selectedTime.getMinutes()).padStart(2, '0');
            setBookingTime(`${hh}:${mm}`);

            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setDate(newDate);
        }
    };

    const handleBook = async () => {
        if (user?.is_blocked) {
            Alert.alert('Account Restricted', 'Your account has been suspended. You cannot book new services at this time.');
            return;
        }

        if (!user?.phone || !user?.address) {
            Alert.alert(
                'Profile Incomplete',
                'Please complete your profile details so we can reach you before booking any service.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Complete Profile', 
                        onPress: () => navigation.navigate('Profile', { screen: 'EditProfile' }) 
                    }
                ]
            );
            return;
        }

        if (!bookingDate || !bookingTime) {
            Alert.alert('Error', 'Please provide recording date (YYYY-MM-DD) and time (HH:MM).');
            return;
        }
        setBooking(true);
        try {
            await client.post('/bookings', {
                service_id: service.id,
                booking_date: bookingDate,
                booking_time: bookingTime,
                total_price: service.price
            });
            Alert.alert('Success', 'Your booking has been placed successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('Home') }
            ]);
        } catch (e) {
            console.error('Booking error:', e);
            Alert.alert('Error', 'Failed to place booking. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imagePlaceholder}></View>
            <View style={styles.content}>
                <Text style={styles.category}>{service.Category?.name}</Text>
                <Text style={styles.title}>{service.name}</Text>
                <Text style={styles.price}>PKR {service.price}</Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>About this service</Text>
                <Text style={styles.description}>{service.description}</Text>

                <View style={styles.specSection}>
                    <View style={styles.specItem}>
                        <View style={styles.specHeader}>
                            <Clock size={14} color="#9CA3AF" />
                            <Text style={styles.specLabel}>Duration</Text>
                        </View>
                        <Text style={styles.specValue}>approx. 2 hours</Text>
                    </View>
                    <View style={styles.specItem}>
                        <View style={styles.specHeader}>
                            <Star size={14} color="#FBBF24" />
                            <Text style={styles.specLabel}>Rating</Text>
                        </View>
                        <Text style={styles.specValue}>4.8 (120 reviews)</Text>
                    </View>
                </View>

                <View style={styles.inputSection}>
                    <Text style={styles.sectionTitle}>When do you need it?</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Calendar size={20} color="#6B7280" />
                        <Text style={[styles.pickerButtonText, !bookingDate && styles.placeholderText]}>
                            {bookingDate || 'Select Date (YYYY-MM-DD)'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Clock size={20} color="#6B7280" />
                        <Text style={[styles.pickerButtonText, !bookingTime && styles.placeholderText]}>
                            {bookingTime || 'Select Time (HH:MM)'}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            minimumDate={new Date()}
                            onChange={onDateChange}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            display="default"
                            onChange={onTimeChange}
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.bookButton, user?.is_blocked && styles.blockedButton]}
                    onPress={handleBook}
                    disabled={booking}
                >
                    <Text style={styles.bookButtonText}>
                        {booking ? 'Processing...' : user?.is_blocked ? 'Account Restricted' : 'Book Service Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imagePlaceholder: { width: '100%', height: 300, backgroundColor: '#E5E7EB' },
    content: { padding: 25, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    category: { color: '#0066FF', fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginTop: 5 },
    price: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 10 },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
    description: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
    specSection: { flexDirection: 'row', marginTop: 25, gap: 40 },
    specItem: {},
    specHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    specLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
    specValue: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginTop: 4 },
    inputSection: { marginTop: 30 },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        padding: 16,
        marginBottom: 15,
        gap: 12,
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
    },
    placeholderText: {
        color: '#9CA3AF',
    },
    bookButton: {
        backgroundColor: '#0066FF',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#0066FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    blockedButton: {
        backgroundColor: '#9CA3AF',
        shadowColor: 'transparent',
    },
    bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
