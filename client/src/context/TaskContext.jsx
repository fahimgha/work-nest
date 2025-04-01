import { createContext, useCallback, useContext, useReducer } from "react";
import { getTasks, newtask } from "../utils/api";

const TaskContext = createContext();

const initialState = {
  tasks: {},
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case "FETCH_TASKS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_TASKS_SUCCESS":
      return { ...state, tasks: action.payload, loading: false };
    case "FETCH_TASKS_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "ADD_TASK_START":
      return state;
    default:
      return state;
  }
}
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async () => {
    dispatch({ type: "FETCH_TASKS_START" });
    try {
      const data = await getTasks();
      dispatch({ type: "FETCH_TASKS_SUCCESS", payload: data.columns });
    } catch (error) {
      dispatch({ type: "FETCH_TASKS_ERROR", payload: error.message });
    }
  }, []);

  const addTask = useCallback(
    async (columnId, task) => {
      dispatch({ type: "ADD_TASK_START" });
      try {
        await newtask(task, false, columnId);
        dispatch({ type: "ADD_TASK_SUCCESS" });
        fetchTasks();
      } catch (error) {
        dispatch({ type: "ADD_TASK_ERROR", payload: error.message });
      }
    },
    [fetchTasks]
  );

  const value = {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    fetchTasks,
    addTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
export function useTasks() {
  return useContext(TaskContext);
}
