import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMeQuery } from '../services/api';
import { Box, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/reducers/authReducer';

interface AuthLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: userData, isLoading, error } = useMeQuery();

  useEffect(() => {
    if (userData?.data) {
      dispatch(setUser({ user: userData.data }));
    }
  }, [userData, dispatch]);

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

  if (error || !userData?.data) {
    console.error("Auth error:", error);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && userData.data.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthLayout;
