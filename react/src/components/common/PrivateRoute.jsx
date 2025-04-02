import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

const PrivateRoute = ({ children }) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default PrivateRoute;