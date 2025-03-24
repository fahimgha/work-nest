import { format } from "date-fns";
import React, { useState, useCallback, memo } from "react";

import AddTaskButton from "../ui/buttons";
import { TaskInput } from "../tasks/taskInput";
import TaskItem from "../tasks/TaskItem";

function DateColumn({
  date,
  tasks,
  onAddTask,
  onDelete,
  handleEditTaskSubmit,
}) {
  const day = format(date, "EEEE");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleAddTask = useCallback(
    (task) => {
      onAddTask(task);
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
            <li key={task.id}>
              <TaskItem
                task={task}
                isEditing={editingTaskId === task.id}
                handleEditTaskSubmit={handleEditTaskSubmit}
                onDelete={onDelete}
                setEditingTaskId={setEditingTaskId}
              />
            </li>
          ))}

          <div className="tasks">
            {isAddingTask ? (
              <TaskInput setInputTask={handleAddTask} />
            ) : (
              <AddTaskButton onClick={startAddingTask} />
            )}
          </div>
        </ol>
      </div>
    </>
  );
}
export default memo(DateColumn);
