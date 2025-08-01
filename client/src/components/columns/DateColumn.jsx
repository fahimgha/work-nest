import { format } from "date-fns";
import { useState, useRef, useCallback, memo } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import TaskInput from "../tasks/TaskInput.jsx";
import AddTaskButton from "../ui/buttons/AddTaskButton";
import { useTasks } from "../../context/TaskContext";
import Task from "../tasks/Task.jsx";
import EmptyLines from "../ui/EmptyLines.jsx";

function DateColumn({ date, tasks, maxTaskCount }) {
  const inputRef = useRef(null);
  const { addTask } = useTasks();
  const day = format(date, "EEEE");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isShowingInput, setIsShowedInput] = useState(true);
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");

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
    <div className="column">
      <div
        className={`column-header + ${date === formattedDate ? "today" : ""}`}
      >
        <h3>{date}</h3>
        <h2>{day}</h2>
      </div>

      <ol className="ol-tasks">
        {tasks.map((task) => (
          <li className="li-tasks" key={task.position}>
            <Task task={task} />
            <div className="task-spacer"></div>
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

        <EmptyLines tasks={tasks} maxTaskCount={maxTaskCount} />
      </ol>
    </div>
  );
}

export default memo(DateColumn);
