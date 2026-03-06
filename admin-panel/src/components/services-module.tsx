"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plus, Trash2, Edit, X, Power, Snowflake, Settings } from 'lucide-react';
import { useState } from 'react';

export default function ServicesModule() {
    const queryClient = useQueryClient();
    const [showAdd, setShowAdd] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [newService, setNewService] = useState({ name: '', description: '', price: '', categoryName: '' });
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const { data: services, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const res = await api.get('/services');
            return res.data;
        }
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        }
    });

    const addMutation = useMutation({
        mutationFn: (data: any) => api.post('/services', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setShowAdd(false);
            setNewService({ name: '', description: '', price: '', categoryName: '' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/services/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] })
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => api.put(`/services/${data.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setEditingService(null);
        }
    });

    const categoryUpdateMutation = useMutation({
        mutationFn: (data: any) => api.put(`/categories/${data.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['services'] });
            setEditingCategory(null);
        }
    });

    const categoryDeleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/categories/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
        onError: (error: any) => alert(error.response?.data?.message || 'Failed to delete category')
    });

    const filteredServices = services?.filter((service: any) => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === '' || service.Category?.name.toLowerCase().includes(categoryFilter.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading services...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-xl font-bold text-gray-800">Available Services</h3>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter by category..."
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full sm:w-48"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            list="search-category-suggestions"
                        />
                        <datalist id="search-category-suggestions">
                            {categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.name} />
                            ))}
                        </datalist>
                    </div>
                    {!showAdd && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowCategoryManager(true)}
                                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all whitespace-nowrap"
                            >
                                <Settings className="h-4 w-4" />
                                Manage Categories
                            </button>
                            <button
                                onClick={() => setShowAdd(true)}
                                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                            >
                                <Plus className="h-4 w-4" />
                                Add Service
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showAdd && (
                <div className="bg-white p-6 rounded-2xl border-2 border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-900">Create New Service</h4>
                        <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Service Name"
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Category Name (e.g. Cleaning, Repair)"
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={newService.categoryName}
                            onChange={(e) => setNewService({ ...newService, categoryName: e.target.value })}
                            list="category-suggestions"
                        />
                        <datalist id="category-suggestions">
                            {categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.name} />
                            ))}
                        </datalist>
                        <input
                            type="number"
                            placeholder="Price (PKR)"
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Short Description"
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all col-span-1 md:col-span-2"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        />
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            onClick={() => setShowAdd(false)}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => addMutation.mutate(newService)}
                            disabled={addMutation.isPending || !newService.name || !newService.categoryName || !newService.price}
                            className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {addMutation.isPending ? 'Creating...' : 'Create Service'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices?.map((service: any) => (
                    <div key={service.id} className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${!service.is_active ? 'opacity-70 bg-gray-50' : ''}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${!service.is_active ? 'bg-gray-200 text-gray-500' : 'bg-primary/10 text-primary'}`}>
                                        {service.Category?.name}
                                    </span>
                                    {!service.is_active && (
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frozen</span>
                                    )}
                                </div>
                                <h4 className={`text-lg font-bold mt-2 ${!service.is_active ? 'text-gray-500' : 'text-gray-900'}`}>{service.name}</h4>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span className={`text-xl font-bold ${!service.is_active ? 'text-gray-400' : 'text-gray-900'}`}>PKR {service.price}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateMutation.mutate({ id: service.id, is_active: !service.is_active })}
                                    className={`p-2 rounded-lg transition-colors ${service.is_active ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-200'}`}
                                    title={service.is_active ? "Freeze Service" : "Activate Service"}
                                >
                                    {service.is_active ? <Snowflake className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => setEditingService({
                                        ...service,
                                        categoryName: service.Category?.name
                                    })}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this service?')) {
                                            deleteMutation.mutate(service.id);
                                        }
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Edit Service</h3>
                            <button onClick={() => setEditingService(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={editingService.name}
                                    onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={editingService.categoryName}
                                    onChange={e => setEditingService({ ...editingService, categoryName: e.target.value })}
                                    list="edit-category-suggestions"
                                />
                                <datalist id="edit-category-suggestions">
                                    {categories?.map((cat: any) => (
                                        <option key={cat.id} value={cat.name} />
                                    ))}
                                </datalist>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={editingService.price}
                                    onChange={e => setEditingService({ ...editingService, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                    value={editingService.description}
                                    onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setEditingService(null)}
                                className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateMutation.mutate(editingService)}
                                disabled={updateMutation.isPending}
                                className="flex-1 bg-primary text-white px-4 py-2 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Manager Modal */}
            {showCategoryManager && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Manage Categories</h3>
                            <button onClick={() => setShowCategoryManager(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {categories?.map((cat: any) => (
                                <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                                            {cat.icon_url ? (
                                                <img src={cat.icon_url} alt="" className="h-10 w-10 object-contain" />
                                            ) : (
                                                <div className="text-[10px] text-gray-300">No Logo</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{cat.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {services?.filter((s: any) => s.category_id === cat.id).length} services
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingCategory(cat)}
                                            className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            title="Edit Logo/Details"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this category? Only succeeds if unused.')) {
                                                    categoryDeleteMutation.mutate(cat.id);
                                                }
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Category Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-6">Edit Category Branding</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={editingCategory.name}
                                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Icon)</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/icon.png"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={editingCategory.icon_url || ''}
                                    onChange={e => setEditingCategory({ ...editingCategory, icon_url: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Paste a URL to an image for the category icon.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => categoryUpdateMutation.mutate(editingCategory)}
                                disabled={categoryUpdateMutation.isPending}
                                className="flex-1 bg-primary text-white px-4 py-2 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {categoryUpdateMutation.isPending ? 'Saving...' : 'Save Branding'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
