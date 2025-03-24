import React, { useCallback, memo } from "react";
import Task from "./Task";
import { TaskInput } from "./taskInput";

function TaskItem({
  task,
  isEditing,
  handleEditTaskSubmit,
  onDelete,
  setEditingTaskId,
}) {
  const handleTaskEdit = useCallback(
    (editedTask) => {
      handleEditTaskSubmit(task.id, { name: editedTask });
      setEditingTaskId(null);
    },
    [task.id, handleEditTaskSubmit, setEditingTaskId]
  );

  const handleStatusChange = useCallback(
    (checked) => handleEditTaskSubmit(task.id, { checked }),
    [task.id, handleEditTaskSubmit]
  );

  const handleDelete = useCallback(
    () => onDelete(task.id),
    [task.id, onDelete]
  );

  const startEditing = useCallback(
    () => setEditingTaskId(task.id),
    [task.id, setEditingTaskId]
  );

  if (isEditing) {
    return <TaskInput setInputTask={handleTaskEdit} isEditing={true} />;
  }

  return (
    <Task
      task={task.name}
      checked={task.checked}
      onChange={handleStatusChange}
      onDelete={handleDelete}
      isEditingTask={startEditing}
    />
  );
}

export default memo(TaskItem);
