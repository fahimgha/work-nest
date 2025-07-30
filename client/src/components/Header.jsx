import { useContext, useState, useEffect, useRef } from "react";
import UserIcon from "./user/UserIcon";
import { AuthContext } from "../context/AuthContext";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/buttons/Button";

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        {user ? (
          <ol className={`olHeaderLeft ${menuOpen ? "show" : ""}`}>
            <NavLink
              to="/app/board"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <li>Board</li>
            </NavLink>
            <NavLink
              to="/app/projects"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <li>My Projects</li>
            </NavLink>
          </ol>
        ) : (
          <ol className={`olHeaderLeft`}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <li>Work Nest</li>
            </NavLink>
          </ol>
        )}
        <div className="rightNavBar">
          <div className="UserIcon">{children}</div>

          {user ? (
            <UserIcon />
          ) : (
            <ol className="olHeaderRight">
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </ol>
          )}
        </div>
      </div>
    </nav>
  );
}
