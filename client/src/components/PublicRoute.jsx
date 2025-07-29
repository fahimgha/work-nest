import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Chargement...</p>;

  if (user) {
    return <Navigate to="/app/board" replace />;
  }

  return children;
}
