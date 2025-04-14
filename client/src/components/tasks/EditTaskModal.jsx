import React, { useState, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";
import { useTasks } from "../../context/TaskContext";
import Checkbox from "../ui/Checkbox";

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
          <h2 className="form-title">Edit Task</h2>
          <div className="form-field">
            <label htmlFor="task-name">Name</label>
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
            <label htmlFor="task-project">Project</label>
            <div className="select-container">
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="select-project"
              >
                <option value="">Without project</option>
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
          <div className="form-field-checkbox">
            <label htmlFor="task-name">Mark as complete</label>
            <Checkbox />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
