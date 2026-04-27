import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, MapPin, Star, Store as StoreIcon } from 'lucide-react';

const UserDashboard = () => {
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

    return (
        <div className="animate-fade-in pb-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-4">Discover the Best Stores</h1>
                <p className="text-text-secondary text-lg">Browse, review, and rate your favorite local businesses.</p>
            </div>

            <div className="mb-10 flex justify-center">
                <div className="relative w-full max-w-2xl">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search stores by name, category, or location..." 
                        className="w-full bg-surface border border-gray-200 rounded-full py-4 pl-12 pr-6 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-shadow hover:shadow-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stores.map(store => (
                    <div key={store.id} className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                        
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-xl text-primary flex items-center gap-2 mb-1">
                                    {store.name}
                                </h3>
                                <div className="flex items-start gap-1 text-text-secondary text-sm">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{store.address}</span>
                                </div>
                            </div>
                            
                            <div className="bg-accent/10 flex flex-col items-center justify-center p-2 rounded-lg min-w-[60px]">
                                <div className="flex items-center gap-1 text-accent font-bold">
                                    <Star fill="currentColor" className="w-4 h-4" />
                                    <span>{store.avgRating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-5 mt-2">
                            <p className="text-sm font-medium text-text-secondary mb-3">
                                {store.myRating ? 'Your Rating' : 'Rate this store'}
                            </p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star}
                                        onClick={() => handleRating(store.id, star)}
                                        className={`p-1 transition-transform hover:scale-110 ${
                                            store.myRating >= star 
                                                ? 'text-accent' 
                                                : 'text-gray-200 hover:text-accent/50'
                                        }`}
                                    >
                                        <Star fill="currentColor" className="w-7 h-7" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {stores.length === 0 && (
                <div className="text-center py-20 bg-surface rounded-2xl shadow-sm border border-gray-100 mt-8">
                    <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-2">No stores found</h3>
                    <p className="text-text-secondary">Try adjusting your search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
