import { createContext, useEffect, useState } from "react";
import { checkAuth, refreshAccessToken } from "../utils/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  user: {},
  setUser: () => {},
  loading: true,
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //temporaire !!!
  const navigate = useNavigate();
  useEffect(() => {
    const verifyUser = async () => {
      const userData = await checkAuth();
      if (!userData) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          userData = await checkAuth();
        }
      }
      if (!userData) {
        navigate("/login");
        console.log("Utilisateur non connecté");
      } else {
        setUser(userData);
      }
      setLoading(false);
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
