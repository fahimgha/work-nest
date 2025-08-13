import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SignUp from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import Projects from "./components/projects/Projects.jsx";
import Home from "./pages/home/Home.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Timer from "./components/timer/timer.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import SharedLayout from "./components/SharedLayout.jsx";
import Board from "./pages/board/Board.jsx";
import AccountActivated from "./pages/EmailVerification/AccountActivated.jsx";
import EmailVerification from "./pages/EmailVerification/EmailVerification.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthContextProvider>
        <PublicRoute>
          <Home />
        </PublicRoute>
      </AuthContextProvider>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthContextProvider>
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      </AuthContextProvider>
    ),
  },

  {
    path: "/email-verification",
    element: (
      <AuthContextProvider>
        <PublicRoute>
          <EmailVerification />
        </PublicRoute>
      </AuthContextProvider>
    ),
  },
  {
    path: "/activate/:token",
    element: (
      <AuthContextProvider>
        <PublicRoute>
          <AccountActivated />
        </PublicRoute>
      </AuthContextProvider>
    ),
  },

  {
    path: "/login",
    element: (
      <AuthContextProvider>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </AuthContextProvider>
    ),
  },

  {
    path: "/app",
    element: (
      <AuthContextProvider>
        <PrivateRoute>
          <SharedLayout />
        </PrivateRoute>
      </AuthContextProvider>
    ),
    children: [
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "timer",
        element: <Timer />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>

  <TaskProvider>
    <RouterProvider router={router} />
  </TaskProvider>

  // </StrictMode>
);
