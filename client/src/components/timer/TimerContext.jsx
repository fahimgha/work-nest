import { createContext, useEffect, useReducer, useContext } from "react";

const TimerContext = createContext();
const DEFAULT_MINUTES = 25;
export const initialState = {
  minutes: DEFAULT_MINUTES,
  seconds: 0,
  projectId: "",
  tasks: [],
  worktimeSession: 0,
  totalWorktime: 0,
  isRunning: false,
  hasSessionStopped: false,
};

export function timerReducer(state, action) {
  switch (action.type) {
    case "ACTION_START":
      const { projectId, existingWorktime = 0 } = action.payload || {};
      if (!projectId) return state;
      return {
        ...state,
        isRunning: true,
        hasSessionStopped: false,
        projectId: projectId,
        totalWorktime: existingWorktime,
        tasks: [],
      };
    case "ACTION_TICK":
      const remainingSeconds = state.minutes * 60 + state.seconds;
      const elapsedSeconds = DEFAULT_MINUTES * 60 - remainingSeconds;
      if (state.seconds > 0) return { ...state, seconds: state.seconds - 1 };
      else if (state.minutes > 0)
        return { ...state, minutes: state.minutes - 1, seconds: 59 };
      else {
        return {
          ...state,
          isRunning: false,
          hasSessionStopped: true,
          worktimeSession: elapsedSeconds,
          totalWorktime: state.totalWorktime + elapsedSeconds,
        };
      }
    case "ACTION_STOP": {
      const remainingSeconds = state.minutes * 60 + state.seconds;
      const elapsedSeconds = DEFAULT_MINUTES * 60 - remainingSeconds;

      return {
        ...state,
        isRunning: false,
        hasSessionStopped: true,
        worktimeSession: elapsedSeconds,
        totalWorktime: state.totalWorktime + elapsedSeconds,
      };
    }
    case "ACTION_END":
      return {
        ...state,
        isRunning: false,
        hasSessionStopped: false,
        projectId: "",
        minutes: DEFAULT_MINUTES,
        seconds: 0,
        worktimeSession: 0,
      };
    default:
      return state;
  }
}
export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, {
    ...initialState,
  });

  useEffect(() => {
    let interval;
    if (state.isRunning) {
      interval = setInterval(() => {
        dispatch({ type: "ACTION_TICK" });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning]);

  const start = (projectId, existingWorktime = 0) =>
    dispatch({
      type: "ACTION_START",
      payload: { projectId, existingWorktime },
    });

  const stop = () => dispatch({ type: "ACTION_STOP" });

  const end = () => dispatch({ type: "ACTION_END" });

  const value = {
    minutes: state.minutes,
    seconds: state.seconds,
    projectId: state.projectId,
    tasks: state.tasks,
    worktimeSession: state.worktimeSession,
    totalWorktime: state.totalWorktime,
    isRunning: state.isRunning,
    hasSessionStopped: state.hasSessionStopped,
    start,
    stop,
    end,
  };
  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}

export function useTimer() {
  return useContext(TimerContext);
}
