import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await axios.post('http://localhost:5000/api/auth/signup', data);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input 
                        type="text" 
                        {...register('name', { 
                            required: 'Name is required',
                            minLength: { value: 20, message: 'Name must be at least 20 characters' },
                            maxLength: { value: 60, message: 'Name must not exceed 60 characters' }
                        })} 
                        className="w-full border rounded px-3 py-2" 
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                        type="email" 
                        {...register('email', { 
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
                        })} 
                        className="w-full border rounded px-3 py-2" 
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea 
                        {...register('address', { 
                            required: 'Address is required',
                            maxLength: { value: 400, message: 'Address must not exceed 400 characters' }
                        })} 
                        className="w-full border rounded px-3 py-2" 
                        rows="3"
                    ></textarea>
                    {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input 
                        type="password" 
                        {...register('password', { 
                            required: 'Password is required',
                            pattern: { 
                                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/, 
                                message: 'Password must be 8-16 chars, 1 uppercase, 1 special character' 
                            }
                        })} 
                        className="w-full border rounded px-3 py-2" 
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Sign Up
                </button>
                
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-500">Log in</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
