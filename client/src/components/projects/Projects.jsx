import styles from "./project.module.css";
import { useTasks } from "../../context/TaskContext";

function Project() {
  const { projects } = useTasks();

  console.log(projects);
  return (
    <div className={styles.container}>
      <h2>Mes Projets</h2>
      <ol className={styles.olProject}>
        {projects.map((project) => {
          return (
            <li className={styles.liProject} key={project.id}>
              <div className={styles.imageProject}></div>
              <div>
                {project.name}
                <h3>{project.description}</h3>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default Project;
