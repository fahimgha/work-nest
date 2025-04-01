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
export const signup = async (email, password) => {
  return await fetchApi("/signup", "POST", { email, password });
};

export const newtask = async (name, checked, date) => {
  return await fetchApi("/tasks", "POST", { name, checked, date });
};

// Fonction pour se connecter
export const login = async (email, password) => {
  return await fetchApi("/login", "POST", { email, password });
};

export const logout = async () => {
  try {
    await fetchApi("/logout", "POST"); // Supprime le cookie côté serveur
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};

// Fonction pour récupérer les tâches de l'utilisateur
export const getTasks = async () => {
  return await fetchApi("/tasks");
};

export const checkAuth = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      credentials: "include", // Assure-toi que les cookies sont bien envoyés
    });

    if (!response.ok) {
      return null; // L'utilisateur n'est pas authentifié
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );
    return null;
  }
};
