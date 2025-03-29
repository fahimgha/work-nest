import { format } from "date-fns";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import TaskItem from "../tasks/TaskItem";
import TaskInput from "../ui/TaskInput";
import AddTaskButton from "../ui/buttons/AddTaskButton";

function DateColumn({
  date,
  tasks,
  onAddTask,
  onDelete,
  handleEditTaskSubmit,
}) {
  const inputRef = useRef(null);
  const day = format(date, "EEEE");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isShowingInput, setIsShowedInput] = useState(true);

  useClickOutside(inputRef, () => {
    if (inputRef.current.querySelector("input").value !== "") {
      handleAddTask(inputRef.current.querySelector("input").value);
    }
    setIsShowedInput(false);
  });

  const handleAddTask = useCallback(
    (task) => {
      onAddTask(task);
      setIsAddingTask(false);
      setIsShowedInput(false);
    },
    [onAddTask]
  );

  const startAddingTask = useCallback(() => {
    setIsAddingTask(true);
    setIsShowedInput(true);
  }, []);

  return (
    <>
      <div className="column">
        <div className="column-header">
          <h3>{date}</h3>
          <h2>{day}</h2>
        </div>
        <ol className="ol-tasks">
          {tasks.map((task) => (
            <li className="li-tasks" key={task.id}>
              <TaskItem
                task={task}
                isEditing={editingTaskId === task.id}
                handleEditTaskSubmit={handleEditTaskSubmit}
                onDelete={onDelete}
                setEditingTaskId={setEditingTaskId}
              />
            </li>
          ))}

          <div className="task">
            {isAddingTask && isShowingInput ? (
              <TaskInput
                setInputTask={handleAddTask}
                isEditing={false}
                inputRef={inputRef}
              />
            ) : (
              <AddTaskButton onClick={startAddingTask} />
            )}
          </div>
        </ol>
      </div>
    </>
  );
}
export default memo(DateColumn);
