import styles from './userIcon.module.css'
import logo from "../../assets/face-portrait.jpg"
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";

export default function UserIcon() {
    const { user } = useContext(AuthContext);
    console.log(user);
    return (<section className={styles.profilIconContainer}>
        <img  className={styles.profilImg}  src={logo} width="50px" height="50px"/>
    </section>)
}