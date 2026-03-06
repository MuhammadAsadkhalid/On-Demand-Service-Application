"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Check, X, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function BookingsModule() {
    const queryClient = useQueryClient();
    const [activeStatus, setActiveStatus] = useState('Pending');
    const { data: bookings, isLoading, refetch } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await api.get('/bookings/all');
            return res.data;
        }
    });

    const updateStatus = async (id: number, status: string) => {
        await api.patch(`/bookings/${id}`, { status });
        refetch();
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/bookings/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Booking deleted');
        }
    });

    const filteredBookings = bookings?.filter((b: any) => b.status === activeStatus);

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading bookings...</div>;

    const statuses = ['Pending', 'Accepted', 'Rejected'];

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {statuses.map(status => (
                    <button
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeStatus === status
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        {status}
                        <span className="ml-2 text-[10px] opacity-70">
                            ({bookings?.filter((b: any) => b.status === status).length || 0})
                        </span>
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredBookings?.map((booking: any) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">{booking.Customer?.name}</p>
                                    <p className="text-xs text-gray-500">{booking.Customer?.email}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{booking.Service?.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {booking.booking_date} at {booking.booking_time}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {booking.status === 'Pending' && <Clock className="h-3 w-3" />}
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {activeStatus === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'Accepted')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Accept"
                                                >
                                                    <Check className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'Rejected')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}
                                        {activeStatus === 'Rejected' && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Delete this record permanently?')) {
                                                        deleteMutation.mutate(booking.id);
                                                    }
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Permanently"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
