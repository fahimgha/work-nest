import { useEffect, useReducer } from "react";
import styles from "./Promodoro.module.css"; // Importer le fichier CSS module

const initialState = {
  minutes: 25,
  seconds: 0,
  mode: "work",
  cycles: 0,
  isRunning: false,
  settings: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    cyclesBeforeLongBreak: 4,
  },
};

function TimerReducer(state, action) {
  switch (action.type) {
    case "ACTION_START":
      return { ...state, isRunning: true };
    case "ACTION_TICK":
      if (state.seconds > 0) {
        return { ...state, seconds: state.seconds - 1 };
      } else if (state.minutes > 0) {
        return { ...state, minutes: state.minutes - 1, seconds: 59 };
      } else {
        let newCycles = state.cycles;
        let newModes;

        if (state.mode === "work") {
          newCycles = newCycles + 1;
          newModes =
            newCycles % state.settings.cyclesBeforeLongBreak === 0
              ? "longBreak"
              : "shortBreak";
        } else {
          newModes = "work";
        }

        const newMinutes =
          newModes === "work"
            ? state.settings.workTime
            : newModes === "shortBreak"
            ? state.settings.shortBreakTime
            : state.settings.longBreakTime;

        return {
          ...state,
          mode: newModes,
          minutes: newMinutes,
          seconds: 0,
          cycles: newCycles,
          isRunning: true,
        };
      }
    case "ACTION_STOP":
      return { ...state, isRunning: false };
    case "ACTION_SKIP": {
      let newMode;
      let newCycles = state.cycles;

      if (state.mode === "work") {
        newCycles = state.cycles + 1;
        newMode =
          newCycles % state.settings.cyclesBeforeLongBreak === 0
            ? "longBreak"
            : "shortBreak";
      } else {
        newMode = "work";
      }

      const newMinutes =
        newMode === "work"
          ? state.settings.workTime
          : newMode === "shortBreak"
          ? state.settings.shortBreakTime
          : state.settings.longBreakTime;

      return {
        ...state,
        mode: newMode,
        minutes: newMinutes,
        seconds: 0,
        cycles: newCycles,
        isRunning: false,
      };
    }
    case "ACTION_RESET":
      return {
        ...state,
        minutes:
          state.mode === "work"
            ? state.settings.workTime
            : state.mode === "shortBreak"
            ? state.settings.shortBreakTime
            : state.settings.longBreakTime,
        seconds: 0,
        isRunning: false,
      };
    default:
      return state;
  }
}

export default function Promodoro() {
  const [state, dispatch] = useReducer(TimerReducer, initialState);

  useEffect(() => {
    let interval;
    if (state.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: "ACTION_TICK" });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.seconds, state.minutes, state.isRunning]);

  const startTimer = () => dispatch({ type: "ACTION_START" });
  const skipTimer = () => dispatch({ type: "ACTION_SKIP" });
  const stopTimer = () => dispatch({ type: "ACTION_STOP" });

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div className={styles.container}>
      <div className={styles.modeBadgeContainer}>
        <div
          className={`${styles.modeBadge} ${
            state.mode === "work" ? styles.modeBadgeFocused : ""
          }`}
          onClick={() => dispatch({ type: "ACTION_RESET" })}
        >
          Travail
        </div>
        <div
          className={`${styles.modeBadge} ${
            state.mode === "shortBreak" ? styles.modeBadgeFocused : ""
          }`}
          onClick={() => dispatch({ type: "ACTION_RESET" })}
        >
          Pause Courte
        </div>
        <div
          className={`${styles.modeBadge} ${
            state.mode === "longBreak" ? styles.modeBadgeFocused : ""
          }`}
          onClick={() => dispatch({ type: "ACTION_RESET" })}
        >
          Pause Longue
        </div>
      </div>

      <div className={styles.timerDisplay}>
        <div className={styles.time}>
          <span className={styles.timeUnit}>{formatTime(state.minutes)}</span>
          <span className={styles.timeSeparator}>:</span>
          <span className={styles.timeUnit}>{formatTime(state.seconds)}</span>
        </div>
        <div className={styles.cycleInfo}>Cycles complétés: {state.cycles}</div>
      </div>

      <div className={styles.buttonContainer}>
        {!state.isRunning ? (
          <button
            className={`${styles.button} ${styles.startButton}`}
            onClick={startTimer}
          >
            Démarrer
          </button>
        ) : (
          <button
            className={`${styles.button} ${styles.stopButton}`}
            onClick={stopTimer}
          >
            Arrêter
          </button>
        )}
        <button
          className={`${styles.button} ${styles.skipButton}`}
          onClick={skipTimer}
        >
          Passer
        </button>
      </div>
    </div>
  );
}
