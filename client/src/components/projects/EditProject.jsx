import { useEffect, useState } from "react";
import styles from "./addProject.module.css";

export default function EditProject({ project, onSubmit, onClose }) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

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
    if (name.trim() === "") return;
    onSubmit({
      ...project,
      name: name,
      description: description,
    });
    // if (onClose) onClose();
  };

  return (
    <>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      <div
        className={styles.modal}
        // onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className={styles.container}>
          <div className={styles.projectFormContainer}>
            <h2>Edit project</h2>
            <h3
              style={{
                fontSize: "0.8rem",
                paddingBottom: "0.75rem",
                fontWeight: "500",
              }}
            >
              Complete the form below to edit a project.
            </h3>
            <form className={styles.projectForm} onSubmit={onSubmitProject}>
              <label className={styles.labelStyle} htmlFor="name">
                Name
              </label>
              <input
                className={styles.inputField}
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                <button
                  className="save-button"
                  type="submit"
                  disabled={name.trim() === ""}
                  style={{
                    opacity: name.trim() === "" ? 0.5 : 1,
                    cursor: name.trim() === "" ? "not-allowed" : "pointer",
                  }}
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
