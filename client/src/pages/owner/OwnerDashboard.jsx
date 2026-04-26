import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/store-owner/dashboard');
            setDashboardData(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch store data', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="p-6">Loading...</div>;

    if (!dashboardData) return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
            <p>You do not own any store currently.</p>
            <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Store: {dashboardData.storeName}</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 shadow rounded">
                    <h3 className="text-gray-500 text-sm">Average Rating</h3>
                    <p className="text-4xl font-bold text-yellow-600">{dashboardData.avgRating}</p>
                </div>
                <div className="bg-white p-6 shadow rounded">
                    <h3 className="text-gray-500 text-sm">Total Ratings Submitted</h3>
                    <p className="text-4xl font-bold">{dashboardData.totalRatings}</p>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Recent Ratings</h2>
                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">User Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Rating Given</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.ratings.map((rating, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="p-3">{rating.user}</td>
                                    <td className="p-3">{rating.email}</td>
                                    <td className="p-3 font-bold">{rating.value} / 5</td>
                                    <td className="p-3">{new Date(rating.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {dashboardData.ratings.length === 0 && (
                        <p className="p-4 text-gray-500">No ratings yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
