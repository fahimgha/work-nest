import { useState, useEffect, useCallback } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";
import ColumnTask from "./columns/DateColumn";
import Pagination from "./Pagination";
import Logout from "./Logout";
import { useTasks } from "../context/TaskContext";

export default function Board() {
  const { tasks, loading, error, fetchTasks, addTask, removeTask, editTask } =
    useTasks();
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [daysToDisplay, setDaysToDisplay] = useState(7);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const updateDaysToDisplay = () => {
      const width = window.innerWidth;
      if (Math.abs(width.current - width) < 100) return;
      if (width >= 1300) setDaysToDisplay(7);
      else if (width >= 600) setDaysToDisplay(3);
      else setDaysToDisplay(1);
    };
    updateDaysToDisplay();

    window.addEventListener("resize", updateDaysToDisplay);

    return () => {
      window.removeEventListener("resize", updateDaysToDisplay);
    };
  }, []);

  const daysDisplay = eachDayOfInterval({
    start: currentStartDate,
    end: addDays(currentStartDate, daysToDisplay - 1),
  });

  const getOnAddTask = useCallback(
    (formattedDate) => (task) => addTask(formattedDate, task),
    [addTask]
  );
  const onDeleteTask = useCallback(
    (taskId) => {
      removeTask(taskId);
    },
    [removeTask]
  );
  const getOnUpdateTask = useCallback(
    (taskId, editedTask) => {
      editTask(taskId, editedTask);
      console.log(taskId, editedTask);
    },
    [tasks, editTask]
  );

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  return (
    <>
      <Logout />
      <Pagination
        currentStartDate={currentStartDate}
        setCurrentStartDate={setCurrentStartDate}
      />

      <section className="column-container">
        {daysDisplay.map((day) => {
          const formattedDate = format(day, "yyyy-MM-dd");
          const column = tasks[formattedDate] || {
            id: formattedDate,
            name: formattedDate,
            tasks: [],
          };
          return (
            <ColumnTask
              key={formattedDate}
              tasks={column.tasks}
              onAddTask={getOnAddTask(formattedDate)}
              date={formattedDate}
              onDelete={onDeleteTask}
              handleEditTaskSubmit={getOnUpdateTask}
            />
          );
        })}
      </section>
    </>
  );
}
