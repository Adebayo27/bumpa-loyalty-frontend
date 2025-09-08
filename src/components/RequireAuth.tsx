import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  role?: 'user' | 'admin';
  children: React.ReactNode;
}

const RequireAuth: React.FC<Props> = ({ role, children }) => {
  const { isAuthenticated, role: authRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || (role && authRole !== role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
