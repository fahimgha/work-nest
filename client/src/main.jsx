import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SignUp from "./pages/signup/Signup.jsx";
import Login from "./pages/login/Login.jsx";
import Projects from "./components/projects/Projects.jsx";
import Home from "./pages/Home.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import Pomodoro from "./components/pomodoro/Pomodoro.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import SharedLayout from "./components/SharedLayout.jsx";
import Board from "./pages/board/Board.jsx";
import AccountActivated from "./pages/EmailVerification/AccountActivated.jsx";
import EmailVerification from "./pages/EmailVerification/EmailVerification.jsx";

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
    path: "/email-verification",
    element: (
      <PublicRoute>
        <EmailVerification />
      </PublicRoute>
    ),
  },
  {
    path: "/activate/:token",
    element: (
      <PublicRoute>
        <AccountActivated />
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
    path: "/",
    element: (
      <PrivateRoute>
        <SharedLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "promodoro",
        element: <Pomodoro />,
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
  <AuthContextProvider>
    <TaskProvider>
      <RouterProvider router={router} />
    </TaskProvider>
  </AuthContextProvider>
  // </StrictMode>
);
