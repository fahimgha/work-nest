import { useState, useMemo, useCallback } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";
import "./App.css";
import ColumnTask from "./components/columns/columnTask";

function App() {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [daysToDisplay, setDaysToDisplay] = useState(7);
  const [board, setBoard] = useState({
    columns: {},
  });

  console.log("App", "render");

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
      const updatedBoard = { ...prevBoard };

      // Créer la colonne si elle n'existe pas encore
      if (!updatedBoard.columns[columnId]) {
        updatedBoard.columns[columnId] = {
          id: columnId,
          name: columnId,
          tasks: [],
        };
      }

      // Ajouter la nouvelle tâche
      const taskId = `task-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      updatedBoard.columns[columnId].tasks.push({
        id: taskId,
        name: newTaskName,
      });

      return updatedBoard;
    });
  }, []);

  return (
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
            column={column}
            tasks={column.tasks}
            // tasks={tasks[formattedDate] || []}
            onAddTask={(newTask) => addTask(column.id, newTask)}
            date={formattedDate}
          />
        );
      })}
    </section>
  );
}

export default App;
