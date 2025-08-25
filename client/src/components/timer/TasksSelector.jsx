import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

export default function TasksSelector({ onChange, tasks, selectedTaskIds }) {
  const [isShowAll, setIsShowAll] = useState(false);

  const uncheckedTasks = tasks.filter((t) => !t.checked);

  const tasksToDisplay = isShowAll ? tasks : uncheckedTasks;

  return (
    <section className="form-field">
      <label htmlFor="select-tasks">
        Add here the tasks you worked on and completed.
      </label>
      <button onClick={() => setIsShowAll((prev) => !prev)}>
        {isShowAll ? "Incomplete tasks only" : "All tasks"}
      </button>
      <select id="select-tasks" onChange={onChange} value="">
        <button>
          <selectedcontent></selectedcontent>
          <HiChevronDown />
        </button>
        <option value="">Select Tasks</option>
        {tasksToDisplay && tasksToDisplay.length > 0 ? (
          tasksToDisplay.map((task) => (
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
