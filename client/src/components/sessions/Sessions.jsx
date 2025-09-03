import { useEffect } from "react";
import styles from "./sessions.module.css";
import { Button } from "../ui/buttons/Button";

import { useTasks } from "../../context/TaskContext";
import { formatSeconds } from "../../utils/time";

export default function Sessions({ title }) {
  const { getAllSessions, sessions, projects } = useTasks();
  useEffect(() => {
    getAllSessions();
  }, [getAllSessions]);

  return (
    <section className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.historyContainer}>
        <h4>Recent Sessions Finished </h4>
        {sessions.length > 0 ? (
          <ol>
            {sessions.map((session) => {
              const project = projects.find((p) => p.id === session.project_id);
              return (
                <li className={styles.listOfSessions} key={session.id}>
                  <div className={styles.item}>
                    <span>Project Name</span>
                    <h4>{project ? project.name : "Unknown Project"}</h4>
                  </div>
                  <div className={styles.item}>
                    <span>Worktime</span>
                    <div className={styles.timerTag}>
                      {formatSeconds(session.worktime)}
                    </div>
                  </div>
                  <div className={styles.item}>
                    <span>Task Completed</span>
                    <h4>{session.tasks_count}</h4>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className={styles.emptySessions}>no sessions saved yet</div>
        )}
        <div className={styles.buttonContainer}>
          <Button>See All</Button>
        </div>
      </div>
    </section>
  );
}
