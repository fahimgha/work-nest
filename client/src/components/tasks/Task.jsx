import React, { memo } from "react";
import Checkbox from "../ui/Checkbox";
import DeleteButton from "../ui/buttons/DeleteTaskButton";
import { useTasks } from "../../context/TaskContext";

function Task({ checked, onChange, task, taskId, isEditingTask }) {
  const { removeTask } = useTasks();
  const handleDelete = () => removeTask(taskId);
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
      <DeleteButton onClick={handleDelete} />
    </div>
  );
}
export default memo(Task);
