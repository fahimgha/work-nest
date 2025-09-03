import styles from "./projects.module.css";
import { useTasks } from "../../context/TaskContext";
import { Title } from "../ui/Title";
import { useState, useEffect } from "react";
import { Button } from "../ui/buttons/Button";
import AddProject from "./AddProject";
import EditProject from "./EditProject.jsx";
import Header from "../Header.jsx";
import { formatSeconds } from "../../utils/time";
import { HiDotsHorizontal } from "react-icons/hi";
import ConfirmDialog from "../ui/ConfirmDialog/ConfirmDialog.jsx";

function Projects() {
  const { projects, addProject, fetchProjects, editProject, removeProject } =
    useTasks();
  const [showConfirm, setShowConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpenId &&
        !e.target.closest(".menu-actions") &&
        !e.target.closest(".toggle-menu-action")
      ) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  const setFormProject = ({ name, description }) => {
    addProject(name, description);
  };

  const handleEditProject = (updatedTask) => {
    editProject(selectedProject.id, updatedTask);
    setShowEditProjectModal(false);
    setSelectedProject(null);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project.id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      await removeProject(projectToDelete);
      setProjectToDelete(null);
      setShowConfirm(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header>
          <div>
            <Button onClick={() => setShowAddProjectModal(true)}>
              Add Project
            </Button>
          </div>
        </Header>

        {showAddProjectModal ? (
          <AddProject
            setFormProject={setFormProject}
            onClose={() => setShowAddProjectModal(false)}
          />
        ) : (
          ""
        )}
      </div>
      <Title>All my Projects</Title>

      {projects.length > 0 ? (
        <ol className={styles.olProject}>
          {projects.map((project) => {
            return (
              <li className={styles.CardProject} key={project.id}>
                <div className={styles.headerCard}>
                  <h4>{project.name}</h4>
                  {project.worktime ? (
                    <span className={styles.timerTag}>
                      {formatSeconds(project.worktime)}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className={styles.border}></div>
                <div className={styles.CardDescription}>
                  <h3 title={project.description || "No description provided"}>
                    {project.description || "No description provided"}
                  </h3>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (menuOpenId === project.id) {
                      setMenuOpenId(null);
                    } else {
                      setMenuOpenId(project.id);
                    }
                  }}
                  className="toggle-menu-action"
                >
                  <HiDotsHorizontal />
                </div>
                <ol
                  className={`menu-actions ${
                    menuOpenId === project.id ? "show" : ""
                  }`}
                >
                  <li
                    onClick={() => {
                      setSelectedProject(project);
                      setShowEditProjectModal(true);
                      setMenuOpenId(null);
                    }}
                  >
                    Edit
                  </li>
                  <li
                    onClick={() => {
                      handleDeleteClick(project);
                      setMenuOpenId(null);
                    }}
                  >
                    Delete
                  </li>
                </ol>
              </li>
            );
          })}
        </ol>
      ) : (
        <div
          style={{
            display: "flex",
            alignSelf: "center",
            margin: "2rem",
          }}
        >
          no project created yet
        </div>
      )}
      {showEditProjectModal ? (
        <EditProject
          project={selectedProject}
          onSubmit={handleEditProject}
          onClose={() => setShowEditProjectModal(false)}
        />
      ) : (
        ""
      )}

      {showConfirm && (
        <ConfirmDialog
          title="Confirm Delete Project"
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmDelete}
        >
          Delete <strong>{projectToDelete?.name}</strong> and all its tasks and
          sessions?
        </ConfirmDialog>
      )}
    </div>
  );
}

export default Projects;
