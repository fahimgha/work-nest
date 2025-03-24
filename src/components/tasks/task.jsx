import React, { memo } from "react";
import { DeleteTaskButton } from "../ui/buttons";
import Checkbox from "../ui/checkbox";
// import { useContext } from "react";
// import { TaskContext } from "../../context/taskContext";

function Task({ checked, onChange, task, onDelete, isEditingTask }) {
  return (
    <>
      <div className="input">
        <Checkbox checked={checked} onChangeCheck={onChange} />
        <div
          onClick={isEditingTask}
          className="tasks"
          style={{
            textDecoration: "none",
          }}
        >
          {task}
        </div>
        <DeleteTaskButton onClick={onDelete} />
      </div>
    </>
  );
}
export default memo(Task);
