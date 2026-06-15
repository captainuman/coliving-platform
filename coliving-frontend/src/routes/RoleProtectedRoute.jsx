import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function RoleProtectedRoute({
  children,
  allowedRole
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return <Navigate to="/login" replace />;
    }

    // Role mismatch
    if (decoded.role !== allowedRole) {
      return <Navigate to="/properties" replace />;
    }

    return children;

  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
} 
