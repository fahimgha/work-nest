import { HiPlus } from "react-icons/hi";

import React, { memo } from "react";

const AddTaskButton = ({ onClick }) => {
  return (
    <button className="addButton" onClick={onClick}>
      <div className="focus-content">
        <HiPlus />
        Add Task
      </div>
    </button>
  );
};

export default memo(AddTaskButton);
