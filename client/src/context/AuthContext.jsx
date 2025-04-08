import { createContext, useEffect, useState } from "react";
import {checkAuth, logout} from "../utils/api";
import {useLocation} from "react-router-dom";

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
        setUser(userData.user[0]);
      } catch (err) {
        console.error("Erreur d'authentification:", err);


      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [location.pathname]);

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
