import { format } from "date-fns";
import React, { useState, useCallback, memo } from "react";
import Task from "../tasks/task";
import AddTaskButton from "../ui/buttons";
import { AddTaskInput, EditTaskInput } from "../tasks/taskInput";

function ColumnTask({
  date,

  tasks,
  onAddTask,
  onDelete,
  handleEditTaskSubmit,
}) {
  const day = format(date, "EEEE");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // console.log(
  //   `ColumnTasconsole.log("ColumnTask", "render");k render for date: ${date}`
  // );
  console.log(tasks);
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
  const startEditingTask = useCallback((taskId) => {
    setEditingTaskId(taskId);
  }, []);

  return (
    <>
      <div className="column">
        <div className="column-header">
          <h3>{date}</h3>
          <h2>{day}</h2>
        </div>
        <ol>
          {tasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            return isEditing ? (
              <EditTaskInput
                key={task.id}
                setEditTaskInput={(editedTask) => {
                  handleEditTaskSubmit(task.id, { name: editedTask });
                  setEditingTaskId(false);
                }}
              />
            ) : (
              <Task
                key={task.id}
                taskId={task.id}
                checked={task.checked}
                onChange={(checked) =>
                  handleEditTaskSubmit(task.id, { checked })
                }
                taskValue={task.name}
                onDelete={() => onDelete(task.id)}
                isEditingTask={() => startEditingTask(task.id)}
              />
            );
          })}

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
export default memo(ColumnTask);
