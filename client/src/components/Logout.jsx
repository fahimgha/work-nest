import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {logout} from "../utils/api.js";

export default function Logout() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();


  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion: ", error);
    }
    setUser(null);
    navigate("/login");
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
