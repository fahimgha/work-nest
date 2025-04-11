import React from "react";
import { Link } from "react-router-dom";
import styles from "./emailVerification.module.css";

export default function EmailVerification() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.icon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-4.5"></path>
            <path d="M22 7 12 13 2 7"></path>
          </svg>
        </div>
        <h1 className={styles.title}>Vérifiez votre boîte mail</h1>
        <p className={styles.description}>
          Un email de vérification a été envoyé à votre adresse. Veuillez
          cliquer sur le lien dans l'email pour activer votre compte.
        </p>
        <p className={styles.note}>
          Si vous ne trouvez pas l'email, vérifiez votre dossier spam ou
          courrier indésirable.
        </p>
        <div className={styles.actions}>
          <Link to="/login" className={styles.buttonSecondary}>
            Revenir à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
