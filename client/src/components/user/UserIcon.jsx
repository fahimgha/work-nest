import styles from "./userIcon.module.css";
import logo from "../../assets/face-portrait.jpg";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../utils/api.js";

export default function UserIcon() {
  const [isDisplayedMenu, setDisplayMenu] = useState(false);
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion: ", error);
    }
    setUser(null);
    navigate("/login");
  };

  const displayMenu = () => {
    setDisplayMenu((prevIsDisplayed) => !prevIsDisplayed);
  };

  if (loading) {
    return <div>Chargement...</div>; // Affiche un indicateur de chargement pendant l'initialisation
  }
  let userData = user;

  const userName = userData.user[0].name || "Utilisateur";
  const userEmail = userData.user[0].email || "Aucun email";

  return (
    <div className={styles.profilIconContainer}>
      <section className={styles.iconContainer} onClick={displayMenu}>
        <img
          className={styles.profilImg}
          src={logo}
          width="50px"
          height="50px"
        />
      </section>
      {isDisplayedMenu ? (
        <section className={styles.menuList}>
          <div className={styles.menuSection}>
            <div className={styles.menuHeader}>
              <div className={styles.userInfo}>
                <img
                  className={styles.profilImg}
                  src={logo}
                  width="45px"
                  height="45px"
                />
                <div className={styles.userInfoRight}>
                  <span className={styles.userName}>{userName}</span>
                  <span className={styles.userEmail}>{userEmail}</span>
                </div>
              </div>
            </div>

            <div className={styles.menuDivider}></div>

            <Link className={styles.menuTitle} to="/profile">
              My Profile
            </Link>

            <Link className={styles.menuLogout} onClick={logoutUser}>
              Log Out
            </Link>
          </div>
        </section>
      ) : (
        ""
      )}
    </div>
  );
}
