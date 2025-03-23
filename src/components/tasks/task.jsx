import React, { memo } from "react";
import { DeleteTaskButton } from "../ui/buttons";
import Checkbox from "../ui/checkbox";

function Task({ checked, onChange, taskValue, onDelete, isEditingTask }) {
  return (
    <>
      <li>
        <div className="input">
          <Checkbox checked={checked} onChangeCheck={onChange} />
          <div
            onClick={isEditingTask}
            className="tasks"
            style={{
              textDecoration: "none",
            }}
          >
            {taskValue}
          </div>
          <DeleteTaskButton onClick={onDelete} />
        </div>
      </li>
    </>
  );
}
export default memo(Task);
