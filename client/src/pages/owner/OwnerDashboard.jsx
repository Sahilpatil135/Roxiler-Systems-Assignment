import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquareText, TrendingUp, Calendar, User } from 'lucide-react';

const OwnerDashboard = () => {
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

    if (loading) return <div className="flex h-[60vh] items-center justify-center text-text-secondary font-medium animate-pulse">Loading dashboard...</div>;

    if (!dashboardData) return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-primary mb-2">Owner Dashboard</h1>
                <p className="text-text-secondary">You do not own any store currently.</p>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-primary">Store Performance</h1>
                <p className="text-text-secondary mt-1">Analytics and recent ratings for <span className="font-bold text-primary">{dashboardData.storeName}</span>.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-surface p-6 shadow-sm rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-accent/10 p-4 rounded-xl text-accent">
                        <Star className="w-8 h-8" fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-text-secondary text-sm font-medium">Average Rating</h3>
                        <p className="text-4xl font-bold text-primary">{dashboardData.avgRating}</p>
                    </div>
                </div>
                <div className="bg-surface p-6 shadow-sm rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="bg-secondary/10 p-4 rounded-xl text-secondary">
                        <MessageSquareText className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-text-secondary text-sm font-medium">Total Ratings</h3>
                        <p className="text-4xl font-bold text-primary">{dashboardData.totalRatings}</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-primary w-6 h-6" />
                    <h2 className="text-2xl font-bold text-primary">Recent Feedback</h2>
                </div>
                
                <div className="bg-surface shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-text-secondary text-sm">
                                    <th className="p-4 font-semibold">User</th>
                                    <th className="p-4 font-semibold">Contact Email</th>
                                    <th className="p-4 font-semibold text-center">Rating</th>
                                    <th className="p-4 font-semibold text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {dashboardData.ratings.map((rating, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-primary flex items-center gap-2">
                                            <div className="bg-primary/5 p-2 rounded-full hidden sm:block">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            {rating.user}
                                        </td>
                                        <td className="p-4 text-text-secondary">{rating.email}</td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2.5 py-1 rounded-md font-bold">
                                                <Star fill="currentColor" className="w-3.5 h-3.5" />
                                                {rating.value}
                                            </span>
                                        </td>
                                        <td className="p-4 text-text-secondary text-right flex items-center justify-end gap-1.5">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(rating.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {dashboardData.ratings.length === 0 && (
                            <div className="text-center py-12">
                                <MessageSquareText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-primary mb-1">No ratings yet</h3>
                                <p className="text-text-secondary text-sm">When users rate your store, their feedback will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
