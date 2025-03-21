import { useState, useMemo, useCallback, useEffect } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";
import "./App.css";
import ColumnTask from "./components/columns/columnTask";

function App() {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [daysToDisplay, setDaysToDisplay] = useState(7);
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    console.log("taks", tasks);
  }, [tasks]);

  const daysDisplay = useMemo(
    () =>
      eachDayOfInterval({
        start: currentStartDate,
        end: addDays(currentStartDate, daysToDisplay - 1),
      }),
    [currentStartDate, daysToDisplay]
  );

  const addTask = useCallback((date, newTask) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      if (!updatedTasks[date]) {
        updatedTasks[date] = [];
      }
      updatedTasks[date].push(newTask);
      return updatedTasks;
    });
  }, []);

  return (
    <>
      <section className="column-container">
        {daysDisplay.map((day) => {
          const formattedDate = format(day, "yyyy-MM-dd");
          return (
            <ColumnTask
              key={day}
              tasks={tasks[formattedDate] || []}
              onAddTask={(newTask) => addTask(formattedDate, newTask)}
              date={formattedDate}
            />
          );
        })}
      </section>
    </>
  );
}

export default App;
