import { HiPlus } from "react-icons/hi";

import React, { memo } from "react";

const AddTaskButton = ({ onClick }) => {
  return (
    <button className="addButton" onClick={onClick}>
      <HiPlus />
      Add Task
    </button>
  );
};

export default memo(AddTaskButton);
