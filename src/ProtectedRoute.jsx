import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/authContext/AuthContext";

// // Protected Route component
// const ProtectedRoute = ({ element }) => {
//   const { isAuthenticated } = useAuth();
//   console.log(isAuthenticated)
//   // const isAuthenticated = true
//   if (!isAuthenticated) {
//     // Redirect to login page if not authenticated
//     return <Navigate to="/authentication/sign-in" />;
//   }
//   return element;
// };

// export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/authContext/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  const location = useLocation();

  return (localStorage.getItem('userToken') || isAuthenticated) ? (
    element
  ) : (
    <Navigate to="/authentication/sign-in" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
