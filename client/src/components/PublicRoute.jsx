import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Chargement...</p>;

  if (user) {
    // Redirect to board if already authenticated
    return <Navigate to="/board" replace />;
  }

  return children;

}
