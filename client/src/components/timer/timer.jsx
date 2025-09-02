import { useEffect, useReducer, useState } from "react";
import styles from "./timer.module.css";
import { Button } from "../ui/buttons/Button";
import DeleteButton from "../ui/buttons/DeleteTaskButton";
import { useTasks } from "../../context/TaskContext";
import { formatSeconds, formatTime } from "../../utils/time";
import ProjectSelector from "./ProjectSelector";
import TasksSelector from "./TasksSelector";
import { useTimer } from "./TimerContext";

export default function Timer({ title }) {
  const {
    projectId: contextProjectId,
    minutes,
    seconds,
    worktimeSession,
    totalWorktime,
    isRunning,
    hasSessionStopped,
    start,
    stop,
    end,
  } = useTimer();
  const [projectId, setProjectId] = useState();
  const [addedTasks, setAddedTasks] = useState([]);
  const {
    projects,
    currentProject,
    currentProjectTasks,
    getProject,
    editProject,
    editTask,
  } = useTasks();

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [isRunning]);

  const handleTaskSelection = (e) => {
    const selectedId = Number(e.target.value);
    if (!selectedId || isNaN(selectedId)) return;

    const selectedTask = currentProjectTasks.find((t) => t.id === selectedId);
    if (selectedTask && !addedTasks.some((t) => t.id === selectedTask.id)) {
      setAddedTasks((prev) => [...prev, selectedTask]);
    }
    e.target.selectedIndex = 0;
  };

  const removeTask = (taskId) => {
    setAddedTasks((prev) => prev.filter((task) => task.id !== taskId));
  };
  const handleSaveSession = () => {
    if (!currentProject) {
      console.log("Aucun projet sélectionné, session non enregistrée");
      return;
    }
    addedTasks.map((task) =>
      editTask(task.id, {
        ...task,
        checked: true,
      })
    );

    editProject(currentProject.id, {
      ...currentProject,
      worktime: totalWorktime,
    });
    setAddedTasks([]);
    setProjectId();
  };

  return (
    <section className={styles.timerSection}>
      <h4 className={styles.taskListTitle}>{title}</h4>

      {hasSessionStopped ? (
        <div className={styles.selectTasksContainer}>
          <h2 style={{ textAlign: "center" }}>
            Session completed
            <br />
            {currentProject?.name} – {formatSeconds(worktimeSession)}
          </h2>
          <TasksSelector
            onChange={handleTaskSelection}
            tasks={currentProjectTasks}
            selectedTaskIds={addedTasks.map((task) => task.id)}
          />
          <div className={styles.buttonContainer}>
            <Button
              onClick={() => {
                handleSaveSession();
                end();
              }}
            >
              Save Session
            </Button>
          </div>
          {addedTasks.length > 0 ? (
            <ol>
              {addedTasks.map((task) => (
                <li className={styles.listOfSelectTasks} key={task.id}>
                  <span>{task.name}</span>
                  <DeleteButton
                    onClick={() => removeTask(task.id)}
                    className="always-visible"
                  />
                </li>
              ))}
            </ol>
          ) : (
            "no selected tasks"
          )}
        </div>
      ) : (
        <div className={styles.selectContainer}>
          <div className={styles.timerDisplay}>
            <div className={styles.time}>
              <span className={styles.timeUnit}>{formatTime(minutes)}</span>
              <span className={styles.timeSeparator}>:</span>
              <span className={styles.timeUnit}>{formatTime(seconds)}</span>
            </div>
          </div>
          <ProjectSelector
            value={contextProjectId}
            onChange={(e) => setProjectId(Number(e.target.value))}
            projects={projects}
          />
          {!isRunning ? (
            <Button
              onClick={() => start(projectId, currentProject?.worktime || 0)}
            >
              Start Session
            </Button>
          ) : (
            <Button onClick={() => stop()}>Stop</Button>
          )}
        </div>
      )}
    </section>
  );
}
