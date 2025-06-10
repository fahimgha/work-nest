import { useContext, useState, useEffect, useRef } from "react";
import UserIcon from "./user/UserIcon";
import { AuthContext } from "../context/AuthContext";
import { Link, NavLink } from "react-router-dom";
export default function Header({ children }) {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen &&
        !e.target.closest(".olHeaderLeft") &&
        !e.target.closest(".menu-toggle")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.addEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav>
      <div className="navBar">
        <div
          className="menu-toggle"
          onClick={(e) =>
            e.target === e.currentTarget && setMenuOpen(!menuOpen)
          }
        >
          <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>

        <ol className={`olHeaderLeft ${menuOpen ? "show" : ""}`}>
          <NavLink
            to="/board"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <li>Home</li>
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <li>My Projects</li>
          </NavLink>
          {/* <NavLink
            to="/promodoro"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <li>Promodoro</li>
          </NavLink> */}
        </ol>
        <div className="rightNavBar">
          <div className="UserIcon">{children}</div>

          {user ? (
            <UserIcon />
          ) : (
            <ol className="olHeaderRight">
              <Link to="/signup">
                <li>Sign Up</li>
              </Link>
              <Link to="/login">
                <li>Login</li>
              </Link>
            </ol>
          )}
        </div>
      </div>
    </nav>
  );
}
