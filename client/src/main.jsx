import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SignUp from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import Home from "./pages/Home.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/board",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider>
  // </StrictMode>
);
