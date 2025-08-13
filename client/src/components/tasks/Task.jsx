import React, { memo, useState } from "react";
import Checkbox from "../ui/Checkbox";
import DeleteButton from "../ui/buttons/DeleteTaskButton";
import EditTaskInput from "./EditTaskInput";
import { useTasks } from "../../context/TaskContext";

function Task({ task, hideCheckbox }) {
  const { removeTask, editTask, projects } = useTasks();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => removeTask(task.id);

  const handleEditClick = () => setIsEditing(true);

  const handleEditSubmit = (updatedTask) => {
    editTask(task.id, updatedTask);
    setIsEditing(false);
  };

  const handleCheckboxChange = (isChecked) => {
    editTask(task.id, {
      ...task,
      checked: isChecked,
    });
  };

  const handleModalClose = () => setIsEditing(false);
  const project = projects.find((p) => p.id === task.project_id);
  const firstLetterOfProject = project?.name.substr(0, 1).toUpperCase();
  return (
    <>
      {!isEditing && (
        <div className="task-container">
          <Checkbox
            checked={task.checked}
            onChangeCheck={handleCheckboxChange}
            hideCheckbox={hideCheckbox}
          />
          <div
            onClick={handleEditClick}
            className="task"
            style={{ textDecoration: task.checked ? "line-through" : "none" }}
          >
            {task.name}
          </div>
          {project ? (
            <div className="task-tag">{firstLetterOfProject}</div>
          ) : (
            ""
          )}
          <DeleteButton onClick={handleDelete} />
        </div>
      )}
      {isEditing && (
        <EditTaskInput
          task={task}
          onSubmit={handleEditSubmit}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

export default memo(Task);
