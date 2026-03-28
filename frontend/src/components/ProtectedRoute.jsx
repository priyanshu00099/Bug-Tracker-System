import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();
  const additionalRolesRaw = localStorage.getItem("additional_roles") || "";
  const additionalRoles = additionalRolesRaw.split(",").map(r => r.trim().toLowerCase()).filter(Boolean);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles) {
    const hasPrimaryRole = allowedRoles.includes(role);
    const hasAdditionalRole = allowedRoles.some(r => additionalRoles.includes(r));
    
    if (!hasPrimaryRole && !hasAdditionalRole) {
      // Redirect to their own primary dashboard if role mismatch
      return <Navigate to={`/${role}`} />;
    }
  }

  return children;
};

export default ProtectedRoute;