import { format } from "date-fns";
import React, { useState, useCallback, memo } from "react";
import Task from "../tasks/task";
import AddTaskButton from "../ui/buttons";
import { AddTaskInput } from "../tasks/taskInput";

function ColumnTask({ date, column, tasks, onAddTask }) {
  const day = format(date, "EEEE");
  const [isAddingTask, setIsAddingTask] = useState(false);

  console.log("ColumnTask", "render");
  console.log(
    `ColumnTasconsole.log("ColumnTask", "render");k render for date: ${date}`
  );

  const handleAddTask = useCallback(
    (newTask) => {
      onAddTask(newTask);
      setIsAddingTask(false);
    },
    [onAddTask]
  );

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
          {tasks.map((task) => (
            <Task key={task.id} taskId={task.id} taskValue={task.name} />
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
export default React.memo(ColumnTask);
