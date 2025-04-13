const BASE_URL = "http://localhost:3000"; // L'URL de ton backend

// Fonction pour envoyer des requêtes API avec des options par défaut
const fetchApi = async (endpoint, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();

  if (!response.ok) {
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
  return await fetchApi(`/tasks/${taskId}`, "PUT", {
    name,
    checked,
    date,
    project_id,
  });
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
        throw new Error("Token expiré ou invalide");
      }
      throw new Error("Erreur de vérification d'authentification");
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authe  ntification:",
      error
    );
  }
};

// AJOUT DES FONCTIONS POUR LES LISTES SPÉCIFIQUES

/**
 * Récupérer les tâches sans projet
 * @returns {Promise<Array>} Liste des tâches sans projet
 */
export const getTasksWithoutProject = async () => {
  const tasks = await getTasks();
  return Object.values(tasks.columns).flatMap((column) =>
    column.tasks.filter((task) => !task.project_id)
  );
};

/**
 * Récupérer les tâches de cette semaine
 * @returns {Promise<Array>} Liste des tâches de cette semaine
 */
export const getTasksThisWeek = async () => {
  const tasks = await getTasks();
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Début de la semaine
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // Fin de la semaine

  return Object.values(tasks.columns).flatMap((column) =>
    column.tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    })
  );
};

/**
 * Récupérer les tâches de la semaine prochaine
 * @returns {Promise<Array>} Liste des tâches de la semaine prochaine
 */
export const getTasksNextWeek = async () => {
  const tasks = await getTasks();
  const now = new Date();
  const startOfNextWeek = new Date(
    now.setDate(now.getDate() - now.getDay() + 7)
  ); // Début de la semaine prochaine
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 7); // Fin de la semaine prochaine

  return Object.values(tasks.columns).flatMap((column) =>
    column.tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate >= startOfNextWeek && taskDate <= endOfNextWeek;
    })
  );
};
