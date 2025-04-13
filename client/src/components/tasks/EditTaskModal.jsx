import React, { useState, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";
import { useTasks } from "../../context/TaskContext";

function EditTaskModal({ task, onSubmit, onClose }) {
  const [name, setName] = useState(task.name);
  const [checked, setChecked] = useState(task.checked);
  const [projectId, setProjectId] = useState(task.project_id || "");
  const { projects } = useTasks();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, checked, project_id: projectId });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-field">
            <label htmlFor="task-name">Task name</label>
            <input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="task-input"
              placeholder="Task name..."
            />
          </div>

          {/* Sélecteur de projet */}
          <div className="form-field">
            <label htmlFor="task-project">Projet</label>
            <div className="select-container">
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="select-project"
              >
                <option value="">Sans projet</option>
                {projects &&
                  projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
              </select>
              <HiChevronDown className="select-icon" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="save-button">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
