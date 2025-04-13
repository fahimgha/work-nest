import React, { memo, useState } from "react";
import Checkbox from "../ui/Checkbox";
import DeleteButton from "../ui/buttons/DeleteTaskButton";
import EditTaskButton from "../ui/buttons/EditTaskButton"; // Import the Edit button
import EditTaskModal from "./EditTaskModal"; // Import the modal for editing
import { useTasks } from "../../context/TaskContext";

function Task({ checked, task, taskId, hideCheckbox }) {
  const { removeTask, editTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => removeTask(taskId);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = (updatedTask) => {
    editTask(taskId, updatedTask);
    setIsEditing(false);
  };
  const handleCheckboxChange = (isChecked) => {
    editTask(taskId, { checked: isChecked });
  };
  const handleModalClose = () => {
    setIsEditing(false);
  };

  return (
    <div className="task-container">
      <Checkbox
        checked={checked}
        onChangeCheck={handleCheckboxChange}
        hideCheckbox={hideCheckbox}
      />
      <div
        className="task"
        style={{ textDecoration: checked ? "line-through" : "none" }}
      >
        {task}
      </div>
      <EditTaskButton onClick={handleEditClick} />
      <DeleteButton onClick={handleDelete} />
      {isEditing && (
        <EditTaskModal
          task={{ id: taskId, name: task, checked }}
          onSubmit={handleEditSubmit}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default memo(Task);
