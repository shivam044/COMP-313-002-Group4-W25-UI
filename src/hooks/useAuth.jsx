import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check if JWT token exists in localStorage
  const token = localStorage.getItem("token");

  // If no token, redirect to the login page
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, allow access to the protected route
  return children;
}

export default ProtectedRoute;
