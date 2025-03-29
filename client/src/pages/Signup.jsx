import React, { useState } from "react";
import { Form, Link } from "react-router-dom";
import styles from "./login.module.css";
import { signup } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");

    // Vérification si l'email et le mot de passe sont remplis
    if (!email || !password) {
      setError("L'email et le mot de passe sont requis.");
      return;
    }

    try {
      const response = await signup(email, password);
      alert(response.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
      alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.DescApp}>
        <h1>Work Nest</h1>
        <h2>
          Gérez vos tâches avec la planification hebdomadaire & Pomodoro. 📅
        </h2>
        <ol>
          <li>Organiser par semaine ⏳</li>
          <li>Focus avec Pomodoro</li>
        </ol>
      </section>
      <div className={styles.loginFormContainer}>
        <h2>Créer votre compte</h2>
        <p>
          Si vous avez déjà un compte, cliquer <Link to="/login">ici </Link>
          pour vous connecter.
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
            Creer mon compte
          </button>
        </form>
      </div>
    </div>
  );
}
