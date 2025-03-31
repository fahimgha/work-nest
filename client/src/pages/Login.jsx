import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { login } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      setError("L'email et le mot de passe sont requis.");
      return;
    }
    try {
      const response = await login(email, password);
      console.log("login", response);
      setUser(response);

      alert(response.message);
      navigate("/board");
    } catch (err) {
      setError(err.message);
      alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginFormContainer}>
        <h2>Se connecter</h2>
        <p>
          Si vous n'avez pas de compte, cliquer <Link to="/signup">ici </Link>
          pour en créer un
        </p>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <label className={styles.labelStyle} htmlFor="email">
            Email
          </label>
          <input
            className={styles.inputField}
            name="email"
            type="email"
            placeholder="Email"
          />

          <label className={styles.labelStyle} htmlFor="password">
            Mot de passe
          </label>
          <input
            className={styles.inputField}
            name="password"
            type="password"
            placeholder="Mot de passe"
          />

          <button className={styles.buttonStyle} type="submit">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
