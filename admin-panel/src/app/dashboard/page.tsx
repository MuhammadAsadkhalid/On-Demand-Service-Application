"use client";

import { useAuth } from '@/hooks/use-auth';
import {
    Users,
    Settings,
    Briefcase,
    Calendar,
    TrendingUp,
    LogOut,
    LayoutDashboard
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';
import api from '@/lib/api';

import BookingsModule from '@/components/bookings-module';
import ServicesModule from '@/components/services-module';
import UsersModule from '@/components/users-module';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const changePasswordMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post('/auth/change-password', {
                currentPassword: data.current,
                newPassword: data.new
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Password changed successfully');
            setIsPasswordModalOpen(false);
            setPasswords({ current: '', new: '', confirm: '' });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    });

    if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50">Loading Admin...</div>;
    if (!user) return null;

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        changePasswordMutation.mutate(passwords);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'users', label: 'Users', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Toaster position="top-right" />
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        Spark Admin
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">{activeTab}</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            <span className="text-sm text-gray-500">Welcome, {user?.name || 'Admin'}</span>
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user?.name?.[0] || 'A'}
                            </div>
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {activeTab === 'dashboard' && <StatsOverview />}
                    {activeTab === 'bookings' && <BookingsModule />}
                    {activeTab === 'services' && <ServicesModule />}
                    {activeTab === 'users' && <UsersModule />}
                </div>

                {/* Password Change Modal */}
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-xl font-bold mb-6">Change Administrator Password</h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={passwords.current}
                                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={passwords.new}
                                        onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={passwords.confirm}
                                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsPasswordModalOpen(false)}
                                        className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={changePasswordMutation.isPending}
                                        className="flex-1 bg-primary text-white px-4 py-2 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function StatsOverview() {
    const { data: statsData, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await api.get('/admin/stats');
            return res.data;
        }
    });

    if (isLoading) return <div className="p-8 text-center text-gray-400 font-medium">Loading statistics...</div>;

    const stats = [
        { label: 'Total Sales', value: `PKR ${statsData?.totalSales || 0}`, trend: statsData?.salesTrend || 'Stable', icon: TrendingUp, color: 'text-green-600' },
        { label: 'Total Bookings', value: statsData?.totalBookings || 0, trend: statsData?.bookingsTrend || 'Stable', icon: Calendar, color: 'text-blue-600' },
        { label: 'Total Users', value: statsData?.totalUsers || 0, trend: '+5%', icon: Users, color: 'text-purple-600' },
        { label: 'Active Services', value: statsData?.activeServices || 0, trend: 'All Systems Go', icon: Briefcase, color: 'text-orange-600' },
        { label: 'Frozen Services', value: statsData?.frozenServices || 0, trend: 'Currently Halted', icon: Settings, color: 'text-gray-600' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                            <p className={`text-xs mt-2 ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-gray-400'}`}>
                                {stat.trend} from last month
                            </p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
