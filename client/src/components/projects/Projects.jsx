import styled from "styled-components";
import { useTasks } from "../../context/TaskContext";

const Container = styled.div`
  min-width: 900px;

  padding: 1rem 0;
  background: #fafafa;
  border-radius: 0.4rem;
`;
function Project() {
  const { projects } = useTasks();

  console.log(projects);
  // const column = projects[formattedDate] || {
  //   id: formattedDate,
  //   name: formattedDate,
  //   tasks: [],
  // };
  return (
    <Container>
      <ol>
        {projects.map((project) => {
          return <li key={project.id}>{project.name}</li>;
        })}
      </ol>
    </Container>
  );
}

export default Project;
