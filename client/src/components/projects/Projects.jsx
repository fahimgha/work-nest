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

function Projects() {
  const { projects, addProject, fetchProjects, editProject, removeProject } =
    useTasks();
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
            const firstLetterOfProject = project.name
              .substr(0, 1)
              .toUpperCase();
            return (
              <li className={styles.liProject} key={project.id}>
                <div className={styles.imageProject}>
                  {firstLetterOfProject}
                </div>
                <div className={styles.textProject}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3rem",
                    }}
                  >
                    <h4>{project.name}</h4>
                    <h5 style={{ margin: 0 }}>
                      {formatSeconds(project.worktime)}
                    </h5>
                  </div>

                  <h3 title={project.description || "no description"}>
                    {project.description || "no description"}
                  </h3>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (menuOpenId === project.id) {
                      setMenuOpenId(null); // fermer si déjà ouvert
                    } else {
                      setMenuOpenId(project.id); // ouvrir pour ce projet
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
                      removeProject(project.id);
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
    </div>
  );
}

export default Projects;
