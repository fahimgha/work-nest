import { createContext, useEffect, useState } from "react";
import { checkAuth } from "../utils/api";

export const AuthContext = createContext({
  user: {},
  setUser: () => {},
  loading: true,
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await checkAuth();

        if (userData?.user) {
          // Si userData.user est un tableau, extrayez l'utilisateur directement
          if (Array.isArray(userData.user) && userData.user.length > 0) {
            setUser(userData.user[0]); // Stocke l'objet directement, pas le tableau
          } else {
            setUser(userData.user);
          }
        } // Vérifiez que `userData.user[0]` contient bien les informations
      } catch (err) {
        console.error("Erreur d'authentification:", err);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const valueUserContext = {
    user: user,
    setUser: setUser,
    loading: loading,
  };
  return (
    <AuthContext.Provider value={valueUserContext}>
      {children}
    </AuthContext.Provider>
  );
};
