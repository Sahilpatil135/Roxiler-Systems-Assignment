import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Store, UserPlus } from 'lucide-react';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await axios.post('http://localhost:5000/api/auth/signup', data);
            toast.success('Registration successful! Please sign in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)] animate-fade-in py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-primary">Create an Account</h2>
                    <p className="text-text-secondary mt-2">Join us to start reviewing and managing stores</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe"
                            {...register('name', { 
                                required: 'Name is required',
                                minLength: { value: 20, message: 'Name must be at least 20 characters' },
                                maxLength: { value: 60, message: 'Name must not exceed 60 characters' }
                            })} 
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                        />
                        {errors.name && <span className="text-error text-xs font-medium mt-1.5 block">{errors.name.message}</span>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="you@example.com"
                            {...register('email', { 
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
                            })} 
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                        />
                        {errors.email && <span className="text-error text-xs font-medium mt-1.5 block">{errors.email.message}</span>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Physical Address</label>
                        <textarea 
                            placeholder="123 Main St, City, Country"
                            {...register('address', { 
                                required: 'Address is required',
                                maxLength: { value: 400, message: 'Address must not exceed 400 characters' }
                            })} 
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                            rows="2"
                        ></textarea>
                        {errors.address && <span className="text-error text-xs font-medium mt-1.5 block">{errors.address.message}</span>}
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            {...register('password', { 
                                required: 'Password is required',
                                pattern: { 
                                    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/, 
                                    message: 'Password must be 8-16 chars, 1 uppercase, 1 special character' 
                                }
                            })} 
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                        />
                        {errors.password && <span className="text-error text-xs font-medium mt-1.5 block">{errors.password.message}</span>}
                    </div>

                    <button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                        <UserPlus className="w-5 h-5" />
                        Create Account
                    </button>
                    
                    <p className="mt-6 text-center text-sm text-text-secondary">
                        Already have an account? <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
