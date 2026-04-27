import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';

// Protected Route wrapper based on Roles
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = React.useContext(AuthContext);

    if (loading) return <div className="flex h-screen items-center justify-center text-secondary font-bold text-xl">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <div className="flex h-screen items-center justify-center text-error font-bold text-xl">Unauthorized Access</div>;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-bg-neutral font-sans flex flex-col text-text-primary">
                    <Toaster position="top-right" 
                        toastOptions={{
                            style: {
                                borderRadius: '10px',
                                background: '#1E2A78',
                                color: '#fff',
                            },
                        }} 
                    />
                    
                    <Navbar />

                    <main className="flex-1 container mx-auto p-4 lg:p-8">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            
                            <Route path="/admin" element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/user" element={
                                <ProtectedRoute allowedRoles={['NORMAL', 'ADMIN', 'STORE_OWNER']}>
                                    <UserDashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/owner" element={
                                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                                    <OwnerDashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
