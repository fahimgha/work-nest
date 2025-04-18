import { useContext } from "react";
import UserIcon from "./user/UserIcon";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header({children}) {
  const { user } = useContext(AuthContext);

  return (
    <nav>
      <div className="navBar">
        <ol className="olHeaderLeft">
          <Link to="/board">
            <li>Home</li>
          </Link>
          <Link to="/projects">
            <li>My Projects</li>
          </Link>
          <Link to="/promodoro">
            <li>Promodoro</li>
          </Link>
        </ol>
        <div style={{display: "flex", alignItems: "center",justifyContent:"space-between", gap: "1rem"}}>
       {children}

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
