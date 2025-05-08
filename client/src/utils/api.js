import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost:3000"; // L'URL de ton backend

export const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: "POST",
      credentials: "include", // Envoi du refresh token stocké dans les cookies
    });

    if (!response.ok) {
      throw new Error("Impossible de rafraîchir le token");
    }

    const data = await response.json();
    // Sauvegarder le nouveau token d'accès
    document.cookie = `token=${data.token}; path=/; Secure; HttpOnly; SameSite=Strict`;
    return true;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    return false;
  }
};
// Fonction pour envoyer des requêtes API avec des options par défaut
const fetchApi = async (endpoint, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: "include", // Assure-toi que le cookie est envoyé
    body: body ? JSON.stringify(body) : null,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error("Réponse invalide du serveur");
  }

  if (!response.ok) {
    if (response.status === 401) {
      // 🔴 TOKEN EXPIRÉ, tenter de rafraîchir le token
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        // Si le token a été rafraîchi, refaire la requête
        return await fetchApi(endpoint, method, body);
      }
      // Si le refresh token échoue, rediriger vers la page de login
      console.log("je suis la ");
      window.location.href = "/login";
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    throw new Error(data.error || "Une erreur s'est produite");
  }

  return data;
};

// Fonction pour s'inscrire
export const signup = async (name, email, password) => {
  return await fetchApi("/signup", "POST", {
    name,
    email,
    password,
  });
};
export const getProjects = async () => {
  return await fetchApi("/projects");
};

export const newProject = async (name, description) => {
  return await fetchApi("/projects", "POST", { name, description });
};
export const newtask = async (name, checked, date, project_id) => {
  return await fetchApi("/tasks", "POST", { name, checked, date, project_id });
};

// Fonction pour se connecter
export const login = async (email, password) => {
  return await fetchApi("/login", "POST", { email, password });
};

export const logout = async () => {
  try {
    await fetchApi("/logout", "POST");
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};

export const getUser = async () => {
  return await fetchApi("/user");
};

// Fonction pour récupérer les tâches de l'utilisateur
export const getTasks = async () => {
  return await fetchApi("/tasks");
};
// Fonction pour modifier une tâche de l'utilisateur
export const putTask = async (taskId, name, checked, date, project_id) => {
  try {
    const response = await fetchApi(`/tasks/${taskId}`, "PUT", {
      name,
      checked,
      date,
      project_id,
    });
    return response;
  } catch (error) {
    console.error("Error in putTask:", error);
    throw error;
  }
};
// Fonction pour supprimer une tâche de l'utilisateur
export const deleteTask = async (taskId) => {
  return await fetchApi(`/tasks/${taskId}`, "DELETE");
};

export const checkAuth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null; // ← Retourne null si pas connecté
      }
      throw new Error("Erreur de vérification d'authentification");
    }

    return await response.json();
  } catch (error) {
    // Ne logue que les erreurs inattendues
    if (error.message !== "Token expiré ou invalide") {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
    }
    return null;
  }
};

// AJOUT DES FONCTIONS POUR LES LISTES SPÉCIFIQUES

export const getTasksWithoutProject = async () => {
  const tasks = await getTasks();
  if (!tasks.columns) {
    return [];
  }
  const allTasks = [];

  // Parcourir chaque colonne
  Object.values(tasks.columns).forEach((column) => {
    allTasks.push(...column.filter((task) => !task.project_id));
  });
  return allTasks;
};

export const getTasksNextWeek = async () => {
  const tasks = await getTasks();
  const now = new Date();

  // Cloner la date pour éviter de modifier l'original
  const startOfNextWeek = new Date(now);
  startOfNextWeek.setDate(now.getDate() - now.getDay() + 7); // Début de la semaine prochaine (lundi)

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6); // Fin de la semaine prochaine (dimanche)

  // Réinitialiser les heures pour comparer uniquement les dates
  startOfNextWeek.setHours(0, 0, 0, 0);
  endOfNextWeek.setHours(23, 59, 59, 999);

  const allNextWeekTasks = [];

  Object.entries(tasks.columns).forEach(([columnId, columnTasks]) => {
    // Dans certains cas, columnTasks peut être un objet avec une propriété 'tasks'
    const tasksArray = Array.isArray(columnTasks)
      ? columnTasks
      : columnTasks.tasks || [];

    const nextWeekTasks = tasksArray.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate >= startOfNextWeek && taskDate <= endOfNextWeek;
    });

    allNextWeekTasks.push(...nextWeekTasks);
  });

  return allNextWeekTasks;
};
