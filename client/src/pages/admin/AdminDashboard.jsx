import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Store, Star, UserPlus, Store as StoreAdd, Search } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
    const [newStoreForm, setNewStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });
    
    const [storeSearch, setStoreSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/dashboard'),
                axios.get('http://localhost:5000/api/admin/users'),
                axios.get('http://localhost:5000/api/admin/stores')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setStores(storesRes.data);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/signup', newUserForm);
            setNewUserForm({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
            fetchDashboardData();
        } catch (error) {
            console.error(error);
            alert('Failed to create user');
        }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newStoreForm, ownerId: parseInt(newStoreForm.ownerId) };
            await axios.post('http://localhost:5000/api/admin/stores', payload);
            setNewStoreForm({ name: '', email: '', address: '', ownerId: '' });
            fetchDashboardData();
        } catch (error) {
            console.error(error);
            alert('Failed to create store. Make sure Owner ID is valid.');
        }
    };

    const filteredStores = stores.filter(s => 
        s.name.toLowerCase().includes(storeSearch.toLowerCase()) || 
        (s.email && s.email.toLowerCase().includes(storeSearch.toLowerCase())) || 
        s.address.toLowerCase().includes(storeSearch.toLowerCase())
    );

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.address.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
        <div className="animate-fade-in pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-primary">Admin Overview</h1>
                <p className="text-text-secondary mt-1">Manage users, stores, and monitor platform activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-surface p-6 shadow-sm rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-xl text-primary">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-text-secondary text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-surface p-6 shadow-sm rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-secondary/10 p-4 rounded-xl text-secondary">
                        <Store className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-text-secondary text-sm font-medium">Total Stores</h3>
                        <p className="text-3xl font-bold text-primary">{stats.totalStores}</p>
                    </div>
                </div>
                <div className="bg-surface p-6 shadow-sm rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-accent/10 p-4 rounded-xl text-accent">
                        <Star className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-text-secondary text-sm font-medium">Total Ratings</h3>
                        <p className="text-3xl font-bold text-primary">{stats.totalRatings}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-surface p-8 shadow-sm rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <UserPlus className="text-primary w-6 h-6" />
                        <h2 className="text-xl font-bold text-primary">Add New User</h2>
                    </div>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <input type="text" placeholder="Full Name" required value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" />
                        <input type="email" placeholder="Email Address" required value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" />
                        <input type="password" placeholder="Password" required value={newUserForm.password} onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" />
                        <input type="text" placeholder="Physical Address" required value={newUserForm.address} onChange={(e) => setNewUserForm({...newUserForm, address: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" />
                        <select value={newUserForm.role} onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all">
                            <option value="NORMAL">Normal User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium px-4 py-3 rounded-lg transition-colors mt-2">Create User</button>
                    </form>
                </div>

                <div className="bg-surface p-8 shadow-sm rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <StoreAdd className="text-secondary w-6 h-6" />
                        <h2 className="text-xl font-bold text-primary">Add New Store</h2>
                    </div>
                    <form onSubmit={handleCreateStore} className="space-y-4">
                        <input type="text" placeholder="Store Name" required value={newStoreForm.name} onChange={(e) => setNewStoreForm({...newStoreForm, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" />
                        <input type="email" placeholder="Store Contact Email" required value={newStoreForm.email} onChange={(e) => setNewStoreForm({...newStoreForm, email: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" />
                        <input type="text" placeholder="Store Location Address" required value={newStoreForm.address} onChange={(e) => setNewStoreForm({...newStoreForm, address: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" />
                        <input type="number" placeholder="Owner's User ID" required value={newStoreForm.ownerId} onChange={(e) => setNewStoreForm({...newStoreForm, ownerId: e.target.value})} className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all" />
                        <button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium px-4 py-3 rounded-lg transition-colors mt-2">Create Store</button>
                    </form>
                </div>
            </div>

            <div className="mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-primary">Store Directory</h2>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Filter stores..." 
                            value={storeSearch}
                            onChange={(e) => setStoreSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        />
                    </div>
                </div>
                <div className="bg-surface shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-text-secondary text-sm">
                                    <th className="p-4 font-semibold">Store Name</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Address</th>
                                    <th className="p-4 font-semibold text-center">Avg Rating</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredStores.map(store => (
                                    <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-primary">{store.name}</td>
                                        <td className="p-4 text-text-secondary">{store.email || 'N/A'}</td>
                                        <td className="p-4 text-text-secondary">{store.address}</td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2.5 py-1 rounded-md font-bold">
                                                <Star fill="currentColor" className="w-3.5 h-3.5" />
                                                {store.avgRating}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStores.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-text-secondary">No stores match your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-primary">User Database</h2>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Filter users..." 
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        />
                    </div>
                </div>
                <div className="bg-surface shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-text-secondary text-sm">
                                    <th className="p-4 font-semibold">ID</th>
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Address</th>
                                    <th className="p-4 font-semibold text-center">Store Rating</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredUsers.map(u => (
                                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-text-secondary">#{u.id}</td>
                                        <td className="p-4 font-medium text-primary">{u.name}</td>
                                        <td className="p-4 text-text-secondary">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                                u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 
                                                u.role === 'STORE_OWNER' ? 'bg-secondary/10 text-secondary' : 
                                                'bg-gray-100 text-text-secondary'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary truncate max-w-xs">{u.address}</td>
                                        <td className="p-4 text-center">
                                            {u.role === 'STORE_OWNER' && u.storeRating ? (
                                                <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-0.5 rounded-md font-bold text-xs">
                                                    <Star fill="currentColor" className="w-3 h-3" />
                                                    {u.storeRating}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-4 text-center text-text-secondary">No users match your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
