import { HiChevronDown } from "react-icons/hi";
export default function ProjectSelector({ value, onChange, projects }) {
  return (
      <select id="select-project" onChange={onChange} value={value}>
        {/* <button>
          <selectedcontent></selectedcontent>
          <HiChevronDown />
        </button> */}
        <option value="">Select project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
  );
}
