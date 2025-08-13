import { HiChevronDown } from "react-icons/hi";
export default function TasksSelector({ onChange, tasks, selectedTaskIds }) {
  return (
    <section className="form-field">
      <label htmlFor="select-tasks">
        Add here the tasks you worked on and completed.
      </label>
      <select id="select-tasks" onChange={onChange} value="">
        <button>
          <selectedcontent></selectedcontent>
          <HiChevronDown />
        </button>
        <option value="">Select Tasks</option>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <option
              key={task.id}
              disabled={selectedTaskIds.includes(task.id)}
              value={task.id}
            >
              {task.name}
            </option>
          ))
        ) : (
          <option disabled>No tasks available</option>
        )}
      </select>
    </section>
  );
}
