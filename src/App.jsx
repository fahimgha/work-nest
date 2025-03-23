import { useState, useMemo, useCallback } from "react";
import { format, eachDayOfInterval, addDays, set } from "date-fns";
import "./App.css";
import ColumnTask from "./components/columns/columnTask";

function App() {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  let daysToDisplay = 7;
  const [board, setBoard] = useState({
    columns: {},
  });

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

    console.log("filtredTask", filteredTask);
    console.log("delete task", taskId);
  };

  const handleEditTask = useCallback((formattedDate, taskId, editedTask) => {
    setBoard((prevBoard) => {
      const column = prevBoard.columns[formattedDate];
      if (!column) return prevBoard;

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

  return (
    <section className="column-container">
      {daysDisplay.map((day) => {
        const formattedDate = format(day, "yyyy-MM-dd");
        const column = useMemo(() => {
          return (
            board.columns[formattedDate] || {
              id: formattedDate,
              name: formattedDate,
              tasks: [],
            }
          );
        }, [board.columns[formattedDate]]);

        // Mémoriser la fonction `onAddTask` pour éviter qu'elle change à chaque render

        const memoizedOnAddTask = useCallback(
          (task) => addTask(formattedDate, task),
          [formattedDate]
        );
        const memoizedOnDeleteTask = useCallback(
          (taskId) => handleDeleteTask(formattedDate, taskId),
          [board.columns[formattedDate]]
        );
        const memoizedOnUpdateTask = useCallback(
          (taskId, edittask) => handleEditTask(formattedDate, taskId, edittask),

          [board.columns[formattedDate]]
        );

        return (
          <ColumnTask
            key={formattedDate}
            tasks={column.tasks}
            onAddTask={memoizedOnAddTask}
            date={formattedDate}
            onDelete={memoizedOnDeleteTask}
            handleEditTaskSubmit={memoizedOnUpdateTask}
          />
        );
      })}
    </section>
  );
}

export default App;
