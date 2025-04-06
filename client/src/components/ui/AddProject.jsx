import styles from "./addProject.module.css";

export default function AddProject() {
  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <div className={styles.projectFormContainer}>
          <h2>Créer un nouveau projet</h2>
          <h3
            style={{
              fontSize: "0.8rem",
              paddingBottom: "0.75rem",
              fontWeight: "500",
            }}
          >
            Remplissez le formulaire ci-dessous pour ajouter un projet.
          </h3>
          <form className={styles.projectForm}>
            <label className={styles.labelStyle} htmlFor="name">
              Nom du projet
            </label>
            <input
              className={styles.inputField}
              name="name"
              type="text"
              placeholder="Nom du projet"
            />

            <label className={styles.labelStyle} htmlFor="description">
              Description
            </label>
            <textarea
              className={styles.inputField}
              name="description"
              type="text"
              placeholder="Description"
            />

            <button className={styles.buttonStyle} type="submit">
              Créer le projet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
