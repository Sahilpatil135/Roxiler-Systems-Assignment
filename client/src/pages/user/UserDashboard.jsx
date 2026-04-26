import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchStores();
    }, [search]);

    const fetchStores = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user/stores?search=${search}`);
            setStores(res.data);
        } catch (error) {
            console.error('Failed to fetch stores', error);
        }
    };

    const handleRating = async (storeId, value) => {
        try {
            await axios.post('http://localhost:5000/api/user/rate', { storeId, value });
            toast.success('Rating submitted successfully!');
            fetchStores(); // refresh to show updated rate
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit rating');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Store Ratings</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>

            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="Search stores by Name or Address..." 
                    className="w-full md:w-1/2 border rounded px-4 py-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map(store => (
                    <div key={store.id} className="bg-white p-6 shadow rounded">
                        <h3 className="font-bold text-xl mb-2">{store.name}</h3>
                        <p className="text-gray-600 mb-4">{store.address}</p>
                        
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold">Avg Rating:</span>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold">
                                {store.avgRating}
                            </span>
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-500 mb-2">
                                {store.myRating ? 'Update your rating:' : 'Rate this store:'}
                            </p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star}
                                        onClick={() => handleRating(store.id, star)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                            store.myRating === star 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        {star}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {stores.length === 0 && <p className="text-gray-500">No stores found.</p>}
            </div>
        </div>
    );
};

export default UserDashboard;
