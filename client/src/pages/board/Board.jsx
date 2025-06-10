import { useState, useEffect, useMemo } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";
import ColumnTask from "../../components/columns/DateColumn.jsx";
import Pagination from "../../components/Pagination.jsx";
import { Button } from "../../components/ui/buttons/Button.jsx";
import { useTasks } from "../../context/TaskContext.jsx";
import AddProject from "../../components/projects/AddProject.jsx";
import styles from "./board.module.css";
import Header from "../../components/Header.jsx";
import Lists from "../../components/list/Lists.jsx";

export default function Board() {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    fetchProjects,
    addProject,
    fetchTasksWithoutProject,
    fetchTasksNextWeek,
  } = useTasks();

  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [daysToDisplay, setDaysToDisplay] = useState(7);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  useEffect(() => {
    fetchTasksWithoutProject();
    fetchTasksNextWeek();
    fetchProjects();
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
  const setFormProject = ({ name, description }) => {
    addProject(name, description);
  };

  const maxTaskCount = useMemo(() => {
    // Utiliser daysDisplay au lieu de dates qui n'existe pas
    return Math.max(
      ...daysDisplay.map((day) => {
        const formattedDate = format(day, "yyyy-MM-dd");
        // Accéder aux tâches pour cette date

        return (tasks[formattedDate]?.tasks || []).length;
      }),
      0 // Valeur par défaut si aucune tâche
    );
  }, [daysDisplay, tasks]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  return (
    <>
      <div className={styles.header}>
        <Header>
          <Pagination
            currentStartDate={currentStartDate}
            setCurrentStartDate={setCurrentStartDate}
          />
        </Header>

        {showAddProjectModal ? (
          <AddProject
            setFormProject={setFormProject}
            onClose={() => setShowAddProjectModal(false)}
          />
        ) : (
          ""
        )}
      </div>
      <section className={styles.columnContainer}>
        {daysDisplay.map((day) => {
          const formattedDate = format(day, "yyyy-MM-dd");
          const columnTasks = tasks[formattedDate] || [];

          return (
            <ColumnTask
              key={formattedDate}
              tasks={columnTasks}
              date={formattedDate}
              maxTaskCount={maxTaskCount}
            />
          );
        })}
      </section>
      <Lists />
    </>
  );
}
