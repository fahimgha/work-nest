import styles from "./projects.module.css";
import { useTasks } from "../../context/TaskContext";
import { Title } from "../ui/Title";
import { useState, useEffect } from "react";
import { Button } from "../ui/buttons/Button";
import AddProject from "./AddProject";
import EditProject from "./EditProject.jsx";
import Header from "../Header.jsx";
import EditTaskButton from "../ui/buttons/EditTaskButton.jsx";
import DeleteTaskButton from "../ui/buttons/DeleteTaskButton.jsx";

function Projects() {
  const { projects, addProject, fetchProjects, editProject, removeProject } =
    useTasks();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

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
                  <h4>{project.name}</h4>

                  <h3 title={project.description || "no description"}>
                    {project.description || "no description"}
                  </h3>
                </div>
                <EditTaskButton
                  onClick={() => {
                    setSelectedProject(project);
                    setShowEditProjectModal(true);
                  }}
                />
                <DeleteTaskButton
                  onClick={() => removeProject(project.id)}
                  className={"del-project"}
                />
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
