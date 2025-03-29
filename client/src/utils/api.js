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

// Fonction pour se connecter
export const login = async (email, password) => {
  return await fetchApi("/login", "POST", { email, password });
};

// Fonction pour récupérer les tâches de l'utilisateur
export const getTasks = async () => {
  return await fetchApi("/board");
};
