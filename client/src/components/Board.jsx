import { useState, useEffect, useCallback } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";
import ColumnTask from "./columns/DateColumn";
import Pagination from "./Pagination";
import Logout from "./Logout";
import { useTasks } from "../context/TaskContext";

export default function Board() {
  const { tasks, loading, error, fetchTasks, addTask } = useTasks();
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
  const handleDeleteTask = (formattedDate, taskId) => {};

  const handleEditTask = useCallback((formattedDate, taskId, editedTask) => {},
  []);

  const getOnAddTask = useCallback(
    (formattedDate) => (task) => addTask(formattedDate, task),
    [addTask]
  );
  const getOnDeleteTask = useCallback(
    (formattedDate) => (taskId) => handleDeleteTask(formattedDate, taskId),
    [handleDeleteTask]
  );
  const getOnUpdateTask = useCallback(
    (formattedDate) => (taskId, editedTask) =>
      handleEditTask(formattedDate, taskId, editedTask),
    [handleEditTask]
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
              onDelete={getOnDeleteTask(formattedDate)}
              handleEditTaskSubmit={getOnUpdateTask(formattedDate)}
            />
          );
        })}
      </section>
    </>
  );
}
