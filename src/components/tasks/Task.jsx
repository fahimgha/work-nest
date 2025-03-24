import React, { memo } from "react";
import Checkbox from "../ui/Checkbox";
import DeleteButton from "../ui/buttons/DeleteTaskButton";
// import { useContext } from "react";
// import { TaskContext } from "../../context/taskContext";

function Task({ checked, onChange, task, onDelete, isEditingTask }) {
  return (
    <div className="input">
      <Checkbox checked={checked} onChangeCheck={onChange} />
      <div
        onClick={isEditingTask}
        className="tasks"
        style={{ textDecoration: checked ? "line-through" : "none" }}
      >
        {task}
      </div>
      <DeleteButton onClick={onDelete} />
    </div>
  );
}
export default memo(Task);
