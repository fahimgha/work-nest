import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./emailVerification.module.css";

export default function AccountActivated() {
  const { token } = useParams(); // Récupère le token de l'URL
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Vérifie la validité du token auprès du backend
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:3000/activate/${token}`); // Remplacez l'URL par celle de votre backend
        if (response.ok) {
          setValid(true);
        } else {
          const error = await response.json();
          setErrorMessage(
            error.error || "Lien d'activation invalide ou expiré."
          );
        }
      } catch (error) {
        setErrorMessage(
          "Une erreur est survenue lors de la vérification du lien."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return <div>Chargement...</div>; // Affiche un indicateur de chargement
  }

  if (!valid) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Erreur</h1>
          <p className={styles.description}>{errorMessage}</p>
          <div className={styles.actions}>
            <Link to="/signup" className={styles.buttonPrimary}>
              Retour à l'inscription
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h1 className={styles.title}>Compte activé avec succès !</h1>
        <p className={styles.description}>
          Votre compte a été vérifié. Vous pouvez maintenant vous connecter et
          commencer à utiliser Work Nest.
        </p>
        <div className={styles.actions}>
          <Link to="/login" className={styles.buttonPrimary}>
            Se connecter maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}
