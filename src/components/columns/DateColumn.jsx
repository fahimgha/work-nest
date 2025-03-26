import { format } from "date-fns";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";

import TaskItem from "../tasks/TaskItem";
import TaskInput from "../ui/TaskInput";
import AddTaskButton from "../ui/buttons/AddTaskButton";

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

          <div className="task">
            {isAddingTask ? (
              <TaskInput setInputTask={handleAddTask} isEditing={false} />
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
