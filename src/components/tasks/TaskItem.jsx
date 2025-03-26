import React, { useEffect, useRef, useCallback, memo } from "react";
import Task from "./Task";
import TaskInput from "../ui/TaskInput";
import { useState } from "react";

function TaskItem({
  task,
  isEditing,
  handleEditTaskSubmit,
  onDelete,
  setEditingTaskId,
}) {
  const inputRef = useRef(null);
  const [isShowingInput, setIsShowedInput] = useState(true);
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsShowedInput(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleTaskEdit = useCallback(
    (editedTask) => {
      handleEditTaskSubmit(task.id, { name: editedTask });
      setIsShowedInput(true);
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

  const startEditing = useCallback(() => {
    setEditingTaskId(task.id);
    setIsShowedInput(true);
  }, [task.id, setEditingTaskId]);

  if (isEditing && isShowingInput) {
    return (
      <TaskInput
        setInputTask={handleTaskEdit}
        inputValue={task.name}
        isEditing={true}
        inputRef={inputRef}
      />
    );
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
