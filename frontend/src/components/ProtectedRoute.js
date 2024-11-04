import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component
const ProtectedRoute = ({ element: Component }) => {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('authToken');

  // If the token exists, allow access to the component
  if (token) {
    return <Component />;
  }

  // If no token is found, redirect to the login page
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
