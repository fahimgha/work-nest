import { format } from "date-fns";
import { useState, useMemo, useCallback } from "react";
import Task from "../tasks/task";
import { AddTaskButton } from "../ui/buttons";
import { AddTaskInput } from "../tasks/taskInput";

export default function ColumnTask({ date, tasks, onAddTask }) {
  const day = format(date, "EEEE");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = useCallback((newTask) => {
    onAddTask(newTask);
    setIsAddingTask(false);
  }, []);

  const startAddingTask = useCallback(() => {
    setIsAddingTask(true);
  }, []);

  return (
    <>
      <div className="column">
        <div className="column-header">
          <h3>{date}</h3>
          <h2>{day}</h2>
        </div>
        <ol>
          {tasks.map((task, index) => (
            <Task key={index} taskValue={task} />
          ))}

          <div className="tasks">
            {isAddingTask ? (
              <AddTaskInput setTaskInput={handleAddTask} />
            ) : (
              <AddTaskButton onClick={startAddingTask} />
            )}
          </div>
        </ol>
      </div>
    </>
  );
}
