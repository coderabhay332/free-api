import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginForm from './pages/login';

import RegisterForm from './pages/Register';

import AppPage from './pages/AppPage';
import AuthLayout from './layouts/auth';
import AdminAnalytics from './components/AdminAnalytics';
import UserAnalytics from './components/UserAnalytics';
function App() {
  const navigate = useNavigate();

  return (
    <Routes> 
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm switchToLogin={() => navigate('/login')} />} />

      <Route path="/user/apps" element={
        <AuthLayout>
          <AppPage />
        </AuthLayout>
      } />
      <Route path="/admin/analytics" element={
         <AuthLayout>
          <AdminAnalytics />
        </AuthLayout>
      } />
      <Route path="/user/analytics" element={
        <AuthLayout>
          <UserAnalytics />
        </AuthLayout>
      } />
    </Routes>
  );
}

export default App;
