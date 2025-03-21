import { useState, useMemo } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";
import "./App.css";
import ColumnTask from "./components/columns/columnTask";

function App() {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [daysToDisplay, setDaysToDisplay] = useState(7);

  const daysDisplay = useMemo(
    () =>
      eachDayOfInterval({
        start: currentStartDate,
        end: addDays(currentStartDate, daysToDisplay - 1),
      }),
    [currentStartDate, daysToDisplay]
  );

  return (
    <>
      <section className="column-container">
        {daysDisplay.map((day) => (
          <ColumnTask key={day} date={format(day, "d MMM yyyy")} />
        ))}
      </section>
    </>
  );
}

export default App;
