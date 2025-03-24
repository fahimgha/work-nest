import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";
import ColumnTask from "./columns/DateColumn";

import Pagination from "./Pagination";

export default function Board() {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [daysToDisplay, setDaysToDisplay] = useState(7);
  const [board, setBoard] = useState({
    columns: {},
  });
  const prevWidthRef = useRef(window.innerWidth);

  console.log("render compoenets");
  useEffect(() => {
    const updateDaysToDisplay = () => {
      const width = window.innerWidth;
      if (Math.abs(prevWidthRef.current - width) < 100) return;
      prevWidthRef.current = width;
      if (width >= 1300) setDaysToDisplay(7);
      else if (width >= 600) setDaysToDisplay(3);
      else setDaysToDisplay(1);
    };
    // Set initial value
    updateDaysToDisplay();

    // Attach event listener
    window.addEventListener("resize", updateDaysToDisplay);
    console.log("render");
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateDaysToDisplay);
    };
  }, []);

  const daysDisplay = useMemo(
    () =>
      eachDayOfInterval({
        start: currentStartDate,
        end: addDays(currentStartDate, daysToDisplay - 1),
      }),
    [currentStartDate, daysToDisplay]
  );

  const addTask = useCallback((columnId, task) => {
    setBoard((prevBoard) => {
      const prevColumn = prevBoard.columns[columnId] || {
        id: columnId,
        name: columnId,
        tasks: [],
      };

      const updatedColumn = {
        ...prevColumn,
        tasks: [
          ...prevColumn.tasks,
          {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: task,
            checked: false,
          },
        ],
      };
      // Retourne un nouvel état en modifiant uniquement la colonne concernée
      return {
        columns: {
          ...prevBoard.columns,
          [columnId]: updatedColumn, // Seule cette colonne change
        },
      };
    });
  }, []);

  const handleDeleteTask = (formattedDate, taskId) => {
    const column = board.columns[formattedDate];

    const filteredTask = column.tasks.filter((task) => task.id !== taskId);

    setBoard((prevBoard) => ({
      columns: {
        ...prevBoard.columns,
        [formattedDate]: {
          ...column,
          tasks: filteredTask,
        },
      },
    }));
  };

  const handleEditTask = useCallback((formattedDate, taskId, editedTask) => {
    setBoard((prevBoard) => {
      const column = prevBoard.columns[formattedDate];

      const updatedTasks = column.tasks.map((task) =>
        task.id === taskId ? { ...task, ...editedTask } : task
      );

      return {
        ...prevBoard,
        columns: {
          ...prevBoard.columns,
          [formattedDate]: {
            ...column,
            tasks: updatedTasks,
          },
        },
      };
    });
  }, []);

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

  return (
    <>
      <Pagination
        currentStartDate={currentStartDate}
        setCurrentStartDate={setCurrentStartDate}
      />
      <section className="column-container">
        {daysDisplay.map((day) => {
          const formattedDate = format(day, "yyyy-MM-dd");
          const column = board.columns[formattedDate] || {
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
