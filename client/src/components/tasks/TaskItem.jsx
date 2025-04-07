import React, { useEffect, useRef, useCallback, memo } from "react";
import Task from "./Task";
import TaskInput from "../ui/TaskInput";
import { useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { useTasks } from "../../context/TaskContext";

function TaskItem({ task, isEditing, setEditingTaskId }) {
  const { editTask } = useTasks();
  const inputRef = useRef(null);
  const [isShowingInput, setIsShowedInput] = useState(true);

  useClickOutside(inputRef, () => {
    if (
      inputRef.current.value !== task.name &&
      inputRef.current.querySelector("input").value !== ""
    ) {
      handleTaskEdit({
        name: inputElement.value,
        project_id: selectElement.value,
      });
    }
    setIsShowedInput(false);
  });
  const handleTaskEdit = useCallback(
    (editedTaskData) => {
      editTask(task.id, {
        ...task,
        name: editedTaskData.name,
        project_id: editedTaskData.project_id,
      });
      setIsShowedInput(true);
      setEditingTaskId(null);
    },
    [task, editTask, setEditingTaskId]
  );

  const handleStatusChange = useCallback(
    (checked) => editTask(task.id, { ...task, checked }),
    [task, editTask]
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
        projectId={task.project_id}
        isEditing={true}
        inputRef={inputRef}
      />
    );
  }

  return (
    <Task
      task={task.name}
      taskId={task.id}
      checked={task.checked}
      onChange={handleStatusChange}
      isEditingTask={startEditing}
    />
  );
}

export default memo(TaskItem);
