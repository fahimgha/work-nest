import { createContext, useCallback, useContext, useReducer } from "react";

import {
  getProjects,
  ApiGetProject,
  getTasks,
  newProject,
  putProject,
  deleteProject,
  newtask,
  putTask,
  deleteTask,
  getTasksNextWeek,
} from "../utils/api";

const TaskContext = createContext();

const initialState = {
  tasks: {},
  projects: [],
  currentProject: null,
  currentProjectTasks: [],
  tasksNextWeek: [],
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case "FETCH_PROJECTS":
      return { ...state, projects: action.payload };
    case "GET_PROJECT":
      return {
        ...state,
        currentProject: action.payload.project,
        currentProjectTasks: action.payload.tasks,
      };
    case "ADD_PROJECTS":
      return state;
    case "EDIT_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.editedProject }
            : p
        ),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.id !== action.payload.projectId
        ),
      };
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

  const getProject = useCallback(async (projectId) => {
    try {
      const data = await ApiGetProject(projectId);
      dispatch({ type: "GET_PROJECT", payload: data });
    } catch (error) {
      console.error("Erreur lors de la recuperation du projet", error);
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

  const editProject = useCallback(
    async (projectId, editedProject) => {
      try {
        await putProject(
          projectId,
          editedProject.name,
          editedProject.description,
          editedProject.worktime
        );
        dispatch({
          type: "EDIT_PROJECT",
          payload: {
            editedProject,
            id: projectId,
          },
        });
      } catch (error) {
        console.error("Erreur lors de l'édition du project:", error);
      }
    },
    [state.projects]
  );
  const removeProject = useCallback(async (projectId) => {
    try {
      await deleteProject(projectId);
      dispatch({ type: "DELETE_PROJECT", payload: { projectId } });
    } catch (error) {
      console.error("Erreur lors de la suppression du project", error);
    }
  }, []);
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
        fetchTasksNextWeek();
      } catch (error) {
        console.error("Erreur lors de l'édition de la tâche:", error);
      }
    },
    [state.tasks]
  );

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
    tasksNextWeek: state.tasksNextWeek,
    currentProject: state.currentProject,
    currentProjectTasks: state.currentProjectTasks,
    projects: state.projects,
    loading: state.loading,
    error: state.error,
    fetchProjects,
    getProject,
    addProject,
    editProject,
    removeProject,
    fetchTasks,
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
