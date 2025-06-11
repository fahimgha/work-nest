import { useState, useEffect, useRef } from "react";
import { useTasks } from "../../context/TaskContext";
import { HiOutlineFolder } from "react-icons/hi";

export default function EditTaskInput({ task, onSubmit, onClose }) {
  const [name, setName] = useState(task.name);
  const [projectId, setProjectId] = useState(task.project_id || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const { projects } = useTasks();
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    setProjectId(task.project_id || null);
  }, [task.project_id]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, project_id: projectId });
  };

  const handleProjectSelect = (projectId) => {
    setProjectId(projectId);
    setMenuOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="edit-task-form"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="input-container">
        <input
          ref={inputRef}
          className="edit-task-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Edit Task"
        />
        <div className="project-selector" ref={menuRef}>
          <button
            type="button"
            className="project-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <HiOutlineFolder />
          </button>
          {menuOpen && (
            <div className="projects-dropdown">
              <div
                className={`project-option ${!projectId ? "selected" : ""}`}
                onClick={() => handleProjectSelect("")}
              >
                Aucun projet
              </div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`project-option ${
                    projectId === project.id ? "selected" : ""
                  }`}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  {project.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
