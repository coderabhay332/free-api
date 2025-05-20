import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './pages/login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UserPage from './pages/UserPage';
function App() {
  return (
    <Routes> 
      <Route path="/" element={<LoginForm />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/user/:id" element={<UserPage />} />
    </Routes>
  );
}
        

export default App;
