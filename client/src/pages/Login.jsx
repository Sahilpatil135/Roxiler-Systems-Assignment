import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', data);
            toast.success('Logged in successfully');
            
            login(res.data.user, res.data.token);
            
            if (res.data.user.role === 'ADMIN') {
                navigate('/admin');
            } else if (res.data.user.role === 'STORE_OWNER') {
                navigate('/owner');
            } else {
                navigate('/user');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                        type="email" 
                        {...register('email', { required: 'Email is required' })} 
                        className="w-full border rounded px-3 py-2" 
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input 
                        type="password" 
                        {...register('password', { required: 'Password is required' })} 
                        className="w-full border rounded px-3 py-2" 
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Login
                </button>
                
                <p className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
