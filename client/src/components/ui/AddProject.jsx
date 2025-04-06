import { useState } from "react";
import styles from "./addProject.module.css";

export default function AddProject({ setFormProject, onClose }) {
  const [successMessage, setSuccessMessage] = useState("");
  const onSubmitProject = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get("name")?.trim();
    const description = data.get("description")?.trim();
    // const inputName = isEditing ? "editInputTask" : "addInputTask";

    if (name) {
      setFormProject({
        name: name,
        description: description,
      });
      // setSuccessMessage(`✅ Projet "${name}" créé avec succès !`);
      // setTimeout(() => setSuccessMessage(""), 4000);
      if (onClose) onClose();

      e.target.reset();
    }
  };

  return (
    <>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
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
            <form className={styles.projectForm} onSubmit={onSubmitProject}>
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
    </>
  );
}
