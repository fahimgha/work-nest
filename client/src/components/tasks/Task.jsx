import React, { memo } from "react";
import Checkbox from "../ui/Checkbox";
import DeleteButton from "../ui/buttons/DeleteTaskButton";

function Task({ checked, onChange, task, onDelete, isEditingTask }) {
  return (
    <div className="task-container">
      <Checkbox checked={checked} onChangeCheck={onChange} />
      <div
        onClick={isEditingTask}
        className="task"
        style={{ textDecoration: checked ? "line-through" : "none" }}
      >
        {task}
      </div>
      <DeleteButton onClick={onDelete} />
    </div>
  );
}
export default memo(Task);
