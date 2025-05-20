import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginForm from './pages/login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RegisterForm from './pages/Register';
import UserPage from './pages/UserPage';
import AuthLayout from './layouts/auth';

function App() {
  const navigate = useNavigate();

  return (
    <Routes> 
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm switchToLogin={() => navigate('/login')} />} />
      <Route path="/admin/dashboard" element={
        <AuthLayout requireAdmin>
          <AdminDashboard />
        </AuthLayout>
      } />
      <Route path="/user" element={
        <AuthLayout>
          <UserDashboard />
        </AuthLayout>
      } />
      <Route path="/user/dashboard" element={
        <AuthLayout>
          <UserPage />
        </AuthLayout>
      } />
    </Routes>
  );
}

export default App;
