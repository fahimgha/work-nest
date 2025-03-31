// import { createContext, useContext, useState, useEffect } from "react";
// import { checkAuth, logout } from "../utils/api";

import { createContext, useEffect, useState } from "react";
import { checkAuth } from "../utils/api";

// const AuthContext = createContext({null});

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verifyUser = async () => {
//       setLoading(true);
//       const userData = await checkAuth();

//       setUser(userData);
//       console.log("Utilisateur récupéré:", userData); // Ajoute ce log
//       setLoading(false);
//     };

//     verifyUser();
//   }, []);

//   const logoutUser = async () => {
//     await logout(); // Supprime la session côté serveur
//     setUser(null); // Réinitialise l'état utilisateur
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

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

  console.log("user", user);

  return (
    <AuthContext.Provider value={valueUserContext}>
      {children}
    </AuthContext.Provider>
  );
};
