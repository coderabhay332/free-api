import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './pages/login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RegisterForm from './pages/Register';
import UserPage from './pages/UserPage';

function App() {
  return (
    <Routes> 
      <Route path="/login" element={<LoginForm />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/user/dashboard" element={<UserPage />} />
    </Routes>
  );
}
        

export default App;
