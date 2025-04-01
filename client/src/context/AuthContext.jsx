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

  const valueUserContext = {
    user: user,
    setUser: setUser,
    loading: loading,
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await checkAuth();
        setUser(userData.user[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={valueUserContext}>
      {children}
    </AuthContext.Provider>
  );
};
