import React, { useState } from "react";
import { FaEllipsisV, FaCheck } from "react-icons/fa";

function TaskAssignDropdown({ projects, onAssignProject }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isProjectsListOpen, setProjectsListOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const toggleProjectsList = () => setProjectsListOpen(!isProjectsListOpen);

  const handleProjectSelect = (project) => {
    setSelectedProject(project.id);
    onAssignProject(project);
    setProjectsListOpen(false); // Ferme la liste après sélection
  };

  return (
    <div className="dropdown-container">
      {/* Icone pour ouvrir le menu */}
      <div className="menu-icon" onClick={toggleMenu}>
        <FaEllipsisV />
      </div>

      {/* Menu déroulant */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={toggleProjectsList}>
            Attribuer à un projet
          </div>
        </div>
      )}

      {/* Liste des projets */}
      {isProjectsListOpen && (
        <div className="projects-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-item"
              onClick={() => handleProjectSelect(project)}
            >
              {project.name}
              {selectedProject === project.id && (
                <FaCheck className="check-icon" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskAssignDropdown;
