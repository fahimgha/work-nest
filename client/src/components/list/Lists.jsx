import React, { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import Task from "../tasks/Task";
import styles from "./lists.module.css";
import MenuList from "./MenuList";
import EmptyLines from "../ui/EmptyLines";
import Timer from "../timer/Timer";

function Lists() {
  const { tasksWithoutProject, tasksNextWeek } = useTasks();
  const [activeFilters, setActiveFilters] = useState(["All"]);

  const handleFilterClick = (filter) => {
    if (filter === "All") {
      setActiveFilters(["All"]);
    } else {
      setActiveFilters((prevFilters) => {
        // Si "All" est actif, on le retire
        if (prevFilters.includes("All")) {
          return [filter];
        }

        // Ajouter ou retirer le filtre cliqué
        if (prevFilters.includes(filter)) {
          const updatedFilters = prevFilters.filter((f) => f !== filter);
          return updatedFilters.length === 0 ? ["All"] : updatedFilters;
        } else {
          return [...prevFilters, filter];
        }
      });
    }
  };

  const shouldDisplay = (filter) => {
    return activeFilters.includes("All") || activeFilters.includes(filter);
  };

  return (
    <div className={styles.container}>
      <MenuList
        activeFilters={activeFilters}
        onFilterClick={handleFilterClick}
      />
      <div className={styles.listsContainer}>
        {shouldDisplay("To Do Next Week") && (
          <TaskList title="To Do Next Week" tasks={tasksNextWeek} />
        )}
        {shouldDisplay("My Timer") && <Timer title="Timer" />}
      </div>
    </div>
  );
}

function TaskList({ title, tasks, className, hideCheckbox }) {
  return (
    <div className={`${styles.taskList} ${className || ""}`}>
      <h4 className={styles.taskListTitle}>{title}</h4>
      <div className="tasks-scroll-container">
        <ol className={styles.taskListItems}>
          {tasks.length > 0 &&
            tasks.map((task) => (
              <li key={task.id} className="li-tasks">
                <Task task={task} hideCheckbox={hideCheckbox} />
                <div className="task-spacer"></div>
              </li>
            ))}
          <EmptyLines tasks={tasks} minTotalItems={8} />
        </ol>
      </div>
    </div>
  );
}

export default Lists;
