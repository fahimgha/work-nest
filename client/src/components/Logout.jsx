import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../utils/api";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Logout() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion: ", error);
    }
  };

  return (
    <nav>
      {user ? (
        <button onClick={logoutUser}>Déconnexion</button>
      ) : (
        <Link to="/login">Connexion</Link>
      )}
    </nav>
  );
}
