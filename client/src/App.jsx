import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';

// Protected Route wrapper based on Roles
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = React.useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <div>Unauthorized Access</div>;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-100 flex flex-col">
                    <Toaster position="top-right" />
                    
                    <main className="flex-1 container mx-auto p-4">
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
