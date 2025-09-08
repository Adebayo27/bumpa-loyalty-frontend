import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminUsers from './pages/AdminUsers';
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <RequireAuth role="user">
          <Dashboard />
        </RequireAuth>
      } />
      <Route path="/admin" element={
        <RequireAuth role="admin">
          <AdminUsers />
        </RequireAuth>
      } />
      <Route path="*" element={<div className="p-8 text-center text-sm">Not Found</div>} />
    </Routes>
  );
};
