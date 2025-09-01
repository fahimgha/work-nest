import { useEffect, useState } from "react";
import styles from "./addProject.module.css";
import { Button } from "../ui/buttons/Button";

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
      <div className={styles.modal}>
        <div className={styles.projectFormContainer}>
          <h2>Edit project</h2>
          <div className={styles.border}></div>
          <form className={styles.projectForm} onSubmit={onSubmitProject}>
            <input
              className={styles.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              type="text"
              placeholder="Project name"
            />
            <textarea
              className={styles.inputField}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="Description"
            />
            <div className="modal-actions">
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button className="save-button" type="submit">
                Edit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
