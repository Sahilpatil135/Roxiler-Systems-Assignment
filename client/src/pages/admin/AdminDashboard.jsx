import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
    const [newStoreForm, setNewStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });

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

    const handleLogout = () => {
        logout();
        navigate('/login');
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

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 shadow rounded">
                    <h3 className="text-gray-500 text-sm">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 shadow rounded">
                    <h3 className="text-gray-500 text-sm">Total Stores</h3>
                    <p className="text-3xl font-bold">{stats.totalStores}</p>
                </div>
                <div className="bg-white p-6 shadow rounded">
                    <h3 className="text-gray-500 text-sm">Total Ratings</h3>
                    <p className="text-3xl font-bold">{stats.totalRatings}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-6 shadow rounded">
                    <h2 className="text-xl font-semibold mb-4">Add User</h2>
                    <form onSubmit={handleCreateUser} className="space-y-3">
                        <input type="text" placeholder="Name" required value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full border p-2 rounded" />
                        <input type="email" placeholder="Email" required value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full border p-2 rounded" />
                        <input type="password" placeholder="Password" required value={newUserForm.password} onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})} className="w-full border p-2 rounded" />
                        <input type="text" placeholder="Address" required value={newUserForm.address} onChange={(e) => setNewUserForm({...newUserForm, address: e.target.value})} className="w-full border p-2 rounded" />
                        <select value={newUserForm.role} onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})} className="w-full border p-2 rounded">
                            <option value="NORMAL">Normal User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create User</button>
                    </form>
                </div>

                <div className="bg-white p-6 shadow rounded">
                    <h2 className="text-xl font-semibold mb-4">Add Store</h2>
                    <form onSubmit={handleCreateStore} className="space-y-3">
                        <input type="text" placeholder="Store Name" required value={newStoreForm.name} onChange={(e) => setNewStoreForm({...newStoreForm, name: e.target.value})} className="w-full border p-2 rounded" />
                        <input type="email" placeholder="Store Email" required value={newStoreForm.email} onChange={(e) => setNewStoreForm({...newStoreForm, email: e.target.value})} className="w-full border p-2 rounded" />
                        <input type="text" placeholder="Store Address" required value={newStoreForm.address} onChange={(e) => setNewStoreForm({...newStoreForm, address: e.target.value})} className="w-full border p-2 rounded" />
                        <input type="number" placeholder="Owner User ID" required value={newStoreForm.ownerId} onChange={(e) => setNewStoreForm({...newStoreForm, ownerId: e.target.value})} className="w-full border p-2 rounded" />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Store</button>
                    </form>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">All Stores</h2>
                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Address</th>
                                <th className="p-3 text-left">Average Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map(store => (
                                <tr key={store.id} className="border-t">
                                    <td className="p-3">{store.name}</td>
                                    <td className="p-3">{store.address}</td>
                                    <td className="p-3">{store.avgRating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">All Users</h2>
                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-left">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-3">{u.id}</td>
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">{u.role}</td>
                                    <td className="p-3">{u.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
