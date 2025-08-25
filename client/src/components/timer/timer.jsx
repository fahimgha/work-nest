import { useEffect, useReducer, useState } from "react";
import styles from "./timer.module.css";
import { Button } from "../ui/buttons/Button";
import DeleteButton from "../ui/buttons/DeleteTaskButton";
import { useTasks } from "../../context/TaskContext";
import { formatSeconds, formatTime } from "../../utils/time";
import { initialState, timerReducer } from "./TimerReducer";
import ProjectSelector from "./ProjectSelector";
import TasksSelector from "./TasksSelector";

export default function Timer({ title }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const [projectId, setProjectId] = useState(null);
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
  }, [projectId]);

  useEffect(() => {
    let interval;
    if (state.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: "ACTION_TICK" });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning]);

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
      worktime: state.totalWorktime,
    });
    setAddedTasks([]);
  };

  return (
    <section
      className={
        styles.timerSection + (state.hasSessionStopped ? " " + styles.full : "")
      }
    >
      <h4 className={styles.taskListTitle}>{title}</h4>
      <div className={styles.container}>
        {state.hasSessionStopped ? (
          <div className={styles.selectTasksContainer}>
            <div>
              <h2>
                Session Completed for
                {" " +
                  currentProject?.name +
                  " " +
                  formatSeconds(state.worktimeSession)}
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
                    dispatch({ type: "ACTION_END" });
                  }}
                >
                  Save Session
                </Button>
              </div>
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
              ""
            )}
          </div>
        ) : (
          <div className={styles.selectContainer}>
            <div className={styles.timerDisplay}>
              <div className={styles.time}>
                <span className={styles.timeUnit}>
                  {formatTime(state.minutes)}
                </span>
                <span className={styles.timeSeparator}>:</span>
                <span className={styles.timeUnit}>
                  {formatTime(state.seconds)}
                </span>
              </div>
            </div>

            <ProjectSelector
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              projects={projects}
            />

            {!state.isRunning ? (
              <Button
                onClick={() =>
                  dispatch({
                    type: "ACTION_START",
                    payload: {
                      projectId,
                      existingWorktime: currentProject?.worktime || 0,
                    },
                  })
                }
              >
                Start
              </Button>
            ) : (
              <Button onClick={() => dispatch({ type: "ACTION_STOP" })}>
                Stop
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
