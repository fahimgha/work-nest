import { createContext, useCallback, useContext, useReducer } from "react";

import {
  deleteTask,
  getProjects,
  getTasks,
  newProject,
  newtask,
  putTask,
  getTasksWithoutProject,
  getTasksNextWeek,
} from "../utils/api";

const TaskContext = createContext();

const initialState = {
  tasks: {},
  projects: [],
  tasksWithoutProject: [],
  tasksNextWeek: [],
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case "FETCH_PROJECTS":
      return { ...state, projects: action.payload };
    case "ADD_PROJECTS":
      return state;
    case "FETCH_TASKS":
      return { ...state, tasks: action.payload, loading: false };
    case "ADD_TASK":
      const newTask = action.payload;
      const columnId = newTask.columnId || newTask.date;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [columnId]: [...(state.tasks[columnId] || []), newTask],
        },
        loading: false,
      };
    case "DELETE_TASK":
      const { taskId } = action.payload;
      const updatedTasksDelete = Object.fromEntries(
        Object.entries(state.tasks).map(([columnId, tasks]) => [
          columnId,
          tasks.filter((task) => task.id !== taskId),
        ])
      );
      return {
        ...state,
        tasks: updatedTasksDelete,
      };
    case "EDIT_TASK":
      const editedTask = action.payload;

      // Créer un nouvel objet tasks avec la tâche modifiée
      const updatedTasks = {};
      Object.entries(state.tasks).forEach(([columnId, columnTasks]) => {
        // Pour chaque colonne, mettre à jour la tâche si elle existe
        updatedTasks[columnId] = columnTasks.map((task) =>
          task.id === editedTask.id ? editedTask : task
        );
      });

      return {
        ...state,
        tasks: updatedTasks,
        loading: false,
      };
    case "FETCH_TASKS_WITHOUT_PROJECT":
      return { ...state, tasksWithoutProject: action.payload, loading: false };
    case "FETCH_TASKS_NEXT_WEEK":
      return { ...state, tasksNextWeek: action.payload, loading: false };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      dispatch({ type: "FETCH_PROJECTS", payload: data.projects });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const addProject = useCallback(
    async (name, description) => {
      try {
        await newProject(name, description);
        dispatch({ type: "ADD_PROJECTS" });
        fetchProjects();
      } catch (error) {
        console.error(error);
      }
    },
    [fetchProjects]
  );

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      dispatch({ type: "FETCH_TASKS", payload: data.columns });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const addTask = useCallback(async (columnId, task) => {
    try {
      const response = await newtask(
        task.name,
        false,
        columnId,
        task.projectId
      );
      if (response && response.task) {
        const newTask = {
          ...response.task,
          date: columnId,
        };
        dispatch({ type: "ADD_TASK", payload: newTask });
        fetchTasksWithoutProject();
        fetchTasksNextWeek();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const removeTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      dispatch({ type: "DELETE_TASK", payload: { taskId } });
      fetchTasksWithoutProject();
      fetchTasksNextWeek();
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
    }
  }, []);

  const editTask = useCallback(
    async (taskId, editedTask) => {
      try {
        await putTask(
          taskId,
          editedTask.name,
          editedTask.checked,
          editedTask.date,
          editedTask.project_id
        );
        dispatch({
          type: "EDIT_TASK",
          payload: {
            ...editedTask,
            id: taskId,
          },
        });
        fetchTasksWithoutProject();
        fetchTasksNextWeek();
      } catch (error) {
        console.error("Erreur lors de l'édition de la tâche:", error);
      }
    },
    [state.tasks]
  );

  const fetchTasksWithoutProject = useCallback(async () => {
    try {
      const tasksWithoutProject = await getTasksWithoutProject();

      dispatch({
        type: "FETCH_TASKS_WITHOUT_PROJECT",
        payload: tasksWithoutProject,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchTasksNextWeek = useCallback(async () => {
    try {
      const data = await getTasksNextWeek();
      // console.log(data);
      dispatch({
        type: "FETCH_TASKS_NEXT_WEEK",
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const value = {
    tasks: state.tasks,
    tasksWithoutProject: state.tasksWithoutProject,
    tasksNextWeek: state.tasksNextWeek,
    projects: state.projects,
    loading: state.loading,
    error: state.error,
    fetchProjects,
    addProject,
    fetchTasks,
    fetchTasksWithoutProject,
    fetchTasksNextWeek,
    addTask,
    removeTask,
    editTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  return useContext(TaskContext);
}
