import { format } from "date-fns";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import TaskItem from "../tasks/TaskItem";
import TaskInput from "../ui/TaskInput";
import AddTaskButton from "../ui/buttons/AddTaskButton";
import { useTasks } from "../../context/TaskContext";

function DateColumn({ date, tasks }) {
  const inputRef = useRef(null);
  const { addTask } = useTasks();
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
        <ol className="ol-tasks">
          {tasks.map((task) => (
            <li className="li-tasks" key={task.id}>
              <TaskItem
                task={task}
                isEditing={editingTaskId === task.id}
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
