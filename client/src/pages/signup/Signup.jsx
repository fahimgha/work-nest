import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../login/login.module.css";
import { signup } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  // const avatarList = [
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-01.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-03.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-05.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-06.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-07.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-09.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-10.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-11.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-18.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-19.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-20.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-22.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-23.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-27.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-28.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-29.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-32.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-33.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-34.svg",
  //   "/avatars/Artboards_Diversity_Avatars_by_Netguru-35.svg",
  // ];
  // const [selectedAvatar, setSelectedAvatar] = useState(avatarList[0]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");

    try {
      const response = await signup(name, email, password);

      navigate("/email-verification");
    } catch (err) {
      // console.error(err);
      // console.dir(err);
      setError(err.message || "Une erreur est survenue lors de l'inscription");
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
        <h2>Create a account</h2>
        <p>
          Si vous avez déjà un compte, cliquer <Link to="/login">ici </Link>
          pour vous connecter.
        </p>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <label className={styles.labelStyle} htmlFor="name">
            Name
          </label>
          <input
            className={styles.inputField}
            name="name"
            type="text"
            placeholder="Name"
          />
          {/* <label className={styles.labelStyle} htmlFor="email">
            Choice a avatar
          </label>
          <div className={styles.avatarGrid}>
            {avatarList.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`${styles.avatar} ${
                  selectedAvatar === avatar ? styles.selectedAvatar : ""
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              />
            ))}
          </div> */}
          <label className={styles.labelStyle} htmlFor="email">
            Email
          </label>
          <input
            className={styles.inputField}
            name="email"
            type="email"
            placeholder="example@mail.com"
          />
          <label className={styles.labelStyle} htmlFor="password">
            Password
          </label>
          <input
            className={styles.inputField}
            name="password"
            type="password"
            placeholder="password"
          />
          <button className={styles.buttonStyle} type="submit">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
