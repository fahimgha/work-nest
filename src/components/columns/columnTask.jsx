import { format } from "date-fns";
import { useState } from "react";
import Task from "../tasks/task";

export default function ColumnTask({ date }) {
  const day = format(date, "EEEE");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const startAddingTask = () => {
    setIsAddingTask(true);
  };
  return (
    <>
      <div className="column">
        <div className="column-header">
          <h3>{date}</h3>
          <h2>{day}</h2>
        </div>
        <ol>
          <Task taskValue="Task 1" />
        </ol>

        <div className="tasks">
          {isAddingTask ? <AddTask /> : <ButtonAdd onClick={startAddingTask} />}
        </div>
      </div>
    </>
  );
}
