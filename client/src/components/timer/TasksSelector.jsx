import { useState } from "react";
import styles from "./timer.module.css";
import { HiChevronDown } from "react-icons/hi";
import { Button } from "../ui/buttons/Button";

export default function TasksSelector({ onChange, tasks, selectedTaskIds }) {
  const [isShowAll, setIsShowAll] = useState(false);

  const uncheckedTasks = tasks.filter((t) => !t.checked);

  const tasksToDisplay = isShowAll ? tasks : uncheckedTasks;

  return (
    <>
      <label htmlFor="select-tasks">
        Add here the tasks you worked on and completed.
      </label>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <select id="select-tasks" onChange={onChange} value="">
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
        {/* <Button onClick={() => setIsShowAll((prev) => !prev)}>
        {isShowAll ? "Hide completed" : "Show completed"}
      </Button> */}
      </div>
    </>
  );
}
