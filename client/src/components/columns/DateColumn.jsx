import { format } from "date-fns";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import useClickOutside from "../../hooks/useClickOutside";
// import TaskItem from "../tasks/TaskItem";
import TaskInput from "../tasks/TaskInput.jsx";
import AddTaskButton from "../ui/buttons/AddTaskButton";
import { useTasks } from "../../context/TaskContext";
import Task from "../tasks/Task.jsx";
import { EmptyLines } from "../ui/EmptyLines.jsx";

function DateColumn({ date, tasks }) {
  const inputRef = useRef(null);
  const { addTask } = useTasks();
  const day = format(date, "EEEE");
  const [isAddingTask, setIsAddingTask] = useState(false);
  // const [editingTaskId, setEditingTaskId] = useState(null);
  const [isShowingInput, setIsShowedInput] = useState(true);

  useClickOutside(inputRef, () => {
    if (inputRef.current.querySelector("input").value !== "") {
      handleAddTask(inputRef.current.querySelector("input").value);
    }
    setIsShowedInput(false);
  });

  const handleAddTask = useCallback(
    (taskData) => {
      addTask(date, taskData);
      setIsAddingTask(false);
      setIsShowedInput(false);
    },
    [addTask, date]
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
        <div className="tasks-scroll-container">
          <ol className="ol-tasks">
            {tasks.map((task) => (
              <li className="li-tasks" key={task.id}>
                <Task
                  taskId={task.id}
                  task={task.name}
                  checked={task.checked}
                  className="task"
                />
              </li>
            ))}

            <li className="li-tasks">
              {isAddingTask && isShowingInput ? (
                <TaskInput
                  setInputTask={handleAddTask}
                  isEditing={false}
                  inputRef={inputRef}
                />
              ) : (
                <AddTaskButton onClick={startAddingTask} />
              )}
            </li>

            {/* Render empty notebook lines */}
            <EmptyLines tasks={tasks} />
            {/* {renderEmptyLines()} */}
          </ol>
        </div>
      </div>
    </>
  );
}
export default memo(DateColumn);
