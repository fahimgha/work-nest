import { useContext, useState } from "react";
import UserIcon from "./user/UserIcon";
import { Button } from "../components/ui/buttons/Button";
import { AuthContext } from "../context/AuthContext";
import { Link, NavLink } from "react-router-dom";

export default function Header({ children }) {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  console.log(menuOpen);

  return (
    <nav>
      <div className="navBar">
        <div className="menu-toggle">
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
        </ol>

        <div className="Children">{children}</div>

        <div className="userIcon">
          <Button>Add Project</Button>
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
