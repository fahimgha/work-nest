import { createContext, useEffect, useState } from "react";
import { checkAuth, refreshAccessToken } from "../utils/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    if (user !== null) {
      setLoading(false); // Arrête le "chargement"
      return;
    }

    const verifyUser = async () => {
      let userData = await checkAuth();

      if (!userData) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          userData = await checkAuth();
        }
      }

      if (!userData || !userData.user || userData.user.length === 0) {
        setUser(null);
      } else {
        setUser(userData.user[0]);
      }

      setLoading(false);
    };

    verifyUser();
  }, [user]);

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
