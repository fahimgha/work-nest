import { useEffect, useState } from "react";
import styles from "./addProject.module.css";

export default function AddProject({ setFormProject, onClose }) {
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const onSubmitProject = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get("name")?.trim();
    const description = data.get("description")?.trim();
    if (name) {
      setFormProject({
        name: name,
        description: description,
      });
      if (onClose) onClose();

      e.target.reset();
    }
  };

  return (
    <>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      <div
        className={styles.modal}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className={styles.container}>
          <div className={styles.projectFormContainer}>
            <h2>Add Project</h2>
            <h3
              style={{
                fontSize: "0.8rem",
                paddingBottom: "0.75rem",
                fontWeight: "500",
              }}
            >
              Complete the form below to add a project.
            </h3>
            <form className={styles.projectForm} onSubmit={onSubmitProject}>
              <label className={styles.labelStyle} htmlFor="name">
                Name
              </label>
              <input
                className={styles.inputField}
                name="name"
                type="text"
                placeholder="Project name"
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
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button className="save-button" type="submit">
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
