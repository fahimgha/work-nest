import styles from "./projects.module.css";
import { useTasks } from "../../context/TaskContext";
import { Title } from "../ui/Title";
import { useState } from "react";
import { Button } from "../ui/buttons/Button";
import AddProject from "./AddProject";
import Header from "../Header.jsx";

function Projects() {
  const { projects, addProject } = useTasks();
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const setFormProject = ({ name, description }) => {
    addProject(name, description);
  };

  console.log(projects);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Header>
          <div>
            <Button onClick={() => setShowAddProjectModal(true)}>
              Créer un projet
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
            const firstLetterOfProject = project.name.substr(0, 1);
            return (
              <li className={styles.liProject} key={project.id}>
                <div className={styles.imageProject}>
                  {firstLetterOfProject}
                </div>
                <div>
                  {project.name}
                  <h3>{project.description}</h3>
                </div>
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
    </div>
  );
}

export default Projects;
