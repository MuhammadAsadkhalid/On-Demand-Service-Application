"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, Shield, Mail, Ban, Unlock, Trash2, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function UsersModule() {
    const queryClient = useQueryClient();
    const [expandedUser, setExpandedUser] = useState<number | null>(null);

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get('/users');
            return res.data;
        }
    });

    const blockMutation = useMutation({
        mutationFn: (userId: number) => api.patch(`/users/block/${userId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });

    const unblockMutation = useMutation({
        mutationFn: (userId: number) => api.patch(`/users/unblock/${userId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });

    const deleteMutation = useMutation({
        mutationFn: (userId: number) => api.delete(`/users/${userId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

    const toggleExpand = (userId: number) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
                {users?.map((user: any) => (
                    <div key={user.id} className="transition-all">
                        <div className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${user.is_blocked ? 'bg-red-50/30' : ''}`}>
                            <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleExpand(user.id)}>
                                <div className="relative">
                                    {user.profile_picture && user.profile_picture.startsWith('data:image') ? (
                                        <img src={user.profile_picture} alt={user.name} className="h-12 w-12 rounded-full object-cover border-2 border-gray-100" />
                                    ) : (
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${user.is_blocked ? 'bg-red-100 text-red-400' : 'bg-primary/10 text-primary font-bold'}`}>
                                            {user.name?.[0] || <User className="h-6 w-6" />}
                                        </div>
                                    )}
                                    {!user.is_blocked && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900">{user.name}</p>
                                        {user.is_blocked && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-100 px-1.5 py-0.5 rounded">Blocked</span>}
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-medium text-primary px-2 py-0.5 bg-primary/5 rounded-full">
                                            <Shield className="h-3 w-3" />
                                            {user.Role?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleExpand(user.id)}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all mr-2"
                                    title="View Details"
                                >
                                    {expandedUser === user.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </button>

                                {user.Role?.name !== 'Admin' && (
                                    <>
                                        {user.is_blocked ? (
                                            <button
                                                onClick={() => unblockMutation.mutate(user.id)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                title="Unblock User"
                                            >
                                                <Unlock className="h-5 w-5" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => blockMutation.mutate(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Block User"
                                            >
                                                <Ban className="h-5 w-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this user? This will remove all their data permanently.')) {
                                                    deleteMutation.mutate(user.id);
                                                }
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {expandedUser === user.id && (
                            <div className="px-24 pb-6 animate-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Phone Number</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{user.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Address</p>
                                            <p className="text-sm font-medium text-gray-700 mt-1">{user.address || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {(!users || users.length === 0) && (
                    <div className="p-12 text-center text-gray-400">No users found.</div>
                )}
            </div>
        </div>
    );
}
