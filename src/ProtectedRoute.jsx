import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

//ProtectedRoute-komponenten hanterar åtkomt till skyddade rutter
//Den tar emot barnkomponenter som ska randeras om användare är autentiserad

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
