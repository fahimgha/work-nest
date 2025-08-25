import { useEffect, useReducer } from "react";

export const initialState = {
  minutes: 25,
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
      if (state.seconds > 0) return { ...state, seconds: state.seconds - 1 };
      else if (state.minutes > 0)
        return { ...state, minutes: state.minutes - 1, seconds: 59 };
      return state;
    case "ACTION_STOP": {
      const remainingSeconds = state.minutes * 60 + state.seconds;
      const elapsedSeconds = 25 * 60 - remainingSeconds;

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
        minutes: 25,
        seconds: 0,
        worktimeSession: 0,
      };
    default:
      return state;
  }
}
export function useTimer(defaultMinutes = 25) {
  const [state, dispatch] = useReducer(timerReducer, {
    ...initialState,
    minutes: defaultMinutes,
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
  const cancel = () => dispatch({ type: "ACTION_CANCEL" });

  return { state, start, stop, end, cancel, dispatch };
}
