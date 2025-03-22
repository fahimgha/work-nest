import { useState, useEffect, useMemo, useCallback } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";
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

  const addTask = useCallback((columnId, newTaskName) => {
    setBoard((prevBoard) => {
      const prevColumn = prevBoard.columns[columnId] || {
        id: columnId,
        name: columnId,
        tasks: [],
      };

      // Création d'une nouvelle colonne uniquement si nécessaire
      const updatedColumn = {
        ...prevColumn,
        tasks: [
          ...prevColumn.tasks,
          {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: newTaskName,
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
          (newTask) => addTask(formattedDate, newTask),
          [formattedDate]
        );

        return (
          <ColumnTask
            key={formattedDate}
            column={column}
            tasks={column.tasks}
            onAddTask={memoizedOnAddTask}
            date={formattedDate}
          />
        );
      })}
    </section>
  );
}

export default App;
