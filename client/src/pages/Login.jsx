import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import { Store, LogIn } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', data);
            toast.success('Welcome back!');
            
            login(res.data.user, res.data.token);
            
            if (res.data.user.role === 'ADMIN') {
                navigate('/admin');
            } else if (res.data.user.role === 'STORE_OWNER') {
                navigate('/owner');
            } else {
                navigate('/user');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-120px)] animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-primary">Welcome back</h2>
                    <p className="text-text-secondary mt-2">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-surface p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="you@example.com"
                            {...register('email', { required: 'Email is required' })} 
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                        />
                        {errors.email && <span className="text-error text-xs font-medium mt-1.5 block">{errors.email.message}</span>}
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required' })} 
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all" 
                        />
                        {errors.password && <span className="text-error text-xs font-medium mt-1.5 block">{errors.password.message}</span>}
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                        <LogIn className="w-5 h-5" />
                        Sign In
                    </button>
                    
                    <p className="mt-6 text-center text-sm text-text-secondary">
                        Don't have an account? <Link to="/signup" className="text-secondary font-semibold hover:text-secondary/80 transition-colors">Create one now</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
