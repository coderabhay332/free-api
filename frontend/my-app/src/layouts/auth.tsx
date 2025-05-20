import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMeQuery } from '../services/api';
import { Box, CircularProgress } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const { data: userData, isLoading } = useMeQuery();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userData?.data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && userData.data.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthLayout;
