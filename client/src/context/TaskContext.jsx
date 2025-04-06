import { createContext, useCallback, useContext, useReducer } from "react";
import {
  deleteTask,
  getProjects,
  getTasks,
  newProject,
  newtask,
  putTask,
} from "../utils/api";

const TaskContext = createContext();

const initialState = {
  tasks: {},
  projects: [],
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case "FETCH_PROJECTS":
      return { ...state, projects: action.payload };
    case "ADD_PROJECT":
      return state;
    case "FETCH_TASKS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_TASKS_SUCCESS":
      return { ...state, tasks: action.payload, loading: false };
    case "FETCH_TASKS_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "ADD_TASK_START":
      return state;
    case "DELETE_TASK_START":
      return state;
    case "EDIT_TASK_START":
      return state;
    case "EDIT_TASK_SUCCESS":
      return { ...state, loading: false };
    case "EDIT_TASK_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      console.log("📦 Projets récupérés depuis l'API:", data);
      dispatch({ type: "FETCH_PROJECTS", payload: data.projects });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const addProject = useCallback(
    async (name, description) => {
      try {
        await newProject(name, description);
        dispatch({ type: "ADD_PROJECT" });
        fetchProjects();
      } catch (error) {
        console.error(error);
      }
    },
    [fetchProjects]
  );

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

  const editTask = useCallback(
    async (taskId, editedTask) => {
      dispatch({ type: "EDIT_TASK_START" });
      try {
        let existingTask = null;
        Object.values(state.tasks).forEach((column) => {
          if (column.tasks) {
            const found = column.tasks.find((t) => t.id === taskId);
            if (found) existingTask = found;
          }
        });
        if (!existingTask) {
          console.error("Tâche non trouvée lors de l'édition:", taskId);
          throw new Error("Tâche non trouvée");
        }
        const updatedTask = { ...existingTask, ...editedTask };

        if (!updatedTask.date) {
          for (const [columnDate, column] of Object.entries(state.tasks)) {
            if (column.tasks && column.tasks.some((t) => t.id === taskId)) {
              updatedTask.date = columnDate;
              break;
            }
          }
        }

        await putTask(
          taskId,
          updatedTask.name,
          updatedTask.checked,
          updatedTask.date
        );

        dispatch({ type: "EDIT_TASK_SUCCESS" });
        fetchTasks();
      } catch (error) {
        console.error("Erreur lors de l'édition de la tâche:", error);
        dispatch({ type: "EDIT_TASK_ERROR", payload: error.message });
      }
    },
    [fetchTasks, state.tasks]
  );

  const removeTask = useCallback(
    async (taskId) => {
      dispatch({ type: "DELETE_TASK_START" });

      try {
        await deleteTask(taskId);
        dispatch({
          type: "DELETE_TASK_SUCCESS",
        });
        fetchTasks();
      } catch (error) {
        dispatch({ type: "DELETE_TASK_ERROR", payload: error.message });
      }
    },
    [fetchTasks]
  );

  const value = {
    tasks: state.tasks,
    projects: state.projects,
    loading: state.loading,
    error: state.error,
    fetchProjects,
    addProject,
    fetchTasks,
    addTask,
    removeTask,
    editTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
export function useTasks() {
  return useContext(TaskContext);
}
