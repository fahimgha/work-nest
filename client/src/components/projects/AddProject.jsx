import { useEffect, useState } from "react";
import styles from "./addProject.module.css";
import { Button } from "../ui/buttons/Button";

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
        <div className={styles.projectFormContainer}>
          <h2>Add New Project</h2>
          <div className={styles.border}></div>
          <form className={styles.projectForm} onSubmit={onSubmitProject}>
            <input
              className={styles.inputField}
              name="name"
              type="text"
              placeholder="Project name"
            />
            <textarea
              className={styles.inputField}
              name="description"
              type="text"
              placeholder="Description"
            />
            <div className="modal-actions">
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Project</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
