import { useContext } from "react";
import {Navigate, useLocation} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p>Chargement...</p>;

  if (!user) {


    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
