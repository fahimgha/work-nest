import { HiPlus } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import React, { memo } from "react";

const AddTaskButton = ({ onClick }) => {
  return (
    <button className="addButton" onClick={onClick}>
      <HiPlus />
      Add Task
    </button>
  );
};

export const DeleteTaskButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="del-button">
      <HiX className="hix-icon" size={12} strokeWidth="0.05rem" />
    </button>
  );
};
export default memo(AddTaskButton);
