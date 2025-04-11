import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "hono/jwt";
import "dotenv/config";
import sql from "./db.mts";
import { logger } from "hono/logger";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { Resend } from "resend";
import { EmailTemplate } from "./emails/EmailTemplate.tsx";

type Variables = {
  user: { id: number; email: string; role: string; exp: number };
};
const app = new Hono<{ Variables: Variables }>();
app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(logger());
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/signup", async (c) => {
  const { name, email, password } = await c.req.json();
  try {
    if (!email || !password || !name) {
      return c.json({ error: "email, mot de passe et nom sont requis " }, 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "l'email invalide" }, 400);
    }
    if (password.length < 8) {
      return c.json(
        { error: "le mot de passe doit avoir au moins 8 caracteres" },
        400
      );
    }
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    console.log("Existing User:", existingUser);

    if (existingUser.length > 0) {
      return c.json({ error: "l'utilisateur existe deja" }, 400);
    }

    const hashedPassword = await hash(password, 12);

    const user = await sql`
      INSERT INTO users(name, email, password) 
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING *
    `;

    const secret_key = process.env.SECRET_KEY;

    const payload = {
      id: user[0].id,
      email: user[0].email,
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
    };

    if (!secret_key) {
      return c.json(
        {
          error: "La clé secrète n'est pas définie dans l'environnement",
        },
        500
      );
    }
    const token = await sign(payload, secret_key);

    await sql`
      INSERT INTO activate_tokens(user_id, token) 
      VALUES (${user[0].id}, ${token})
    `;
    // Envoi du mail de vérification via Resend
    const { data, error } = await resend.emails.send({
      from: `${process.env.DOMAIN}`,
      to: email,
      subject: "Verify Email",
      text: `Please activate your account by clicking the following link: 
      http://localhost:5173/activate/${token}`,
    });

    if (error) {
      console.log("Erreur lors de l'envoi de l'email:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      message: "Inscription réussie. Un email de vérification a été envoyé.",
      data: data,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return c.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      500
    );
  }
});
app.get("/activate/:token", async (c) => {
  const token = c.req.param("token");

  try {
    // Vérifier si le token existe dans la base de données
    const tokenData = await sql`
      SELECT * FROM activate_tokens WHERE token = ${token}
    `;

    if (tokenData.length === 0) {
      return c.json({ error: "Lien d'activation invalide ou expiré" }, 400);
    }

    const userId = tokenData[0].user_id;

    // Vérifier si l'utilisateur existe
    const user = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;

    if (user.length === 0) {
      return c.json({ error: "Utilisateur non trouvé" }, 404);
    }

    // Si l'utilisateur est déjà actif
    if (user[0].activeToken) {
      return c.text(
        "Votre compte est déjà vérifié. Veuillez vous connecter.",
        200
      );
    }

    await sql`
      UPDATE users SET activeToken = true WHERE id = ${userId}
    `;

    // await sql`
    //   DELETE FROM activate_tokens WHERE token = ${token}
    // `;

    return c.json({ success: true, message: "Compte activé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'activation du compte:", error);
    return c.json({ error: "Erreur lors de l'activation du compte" }, 500);
  }
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  try {
    if (!email || !password) {
      return c.json({ error: "email et mot de passe sont requis" }, 400);
    }
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    const result = user[0];
    console.log(result);

    if (user.length === 0) {
      return c.json({ error: "cette utilisateur n'existe pas " }, 400);
    }

    const passwordMatch = await compare(password, user[0].password);
    if (!passwordMatch) {
      return c.json({ error: "mot de passe n'est pas correct" }, 400);
    }

    // Email trouvé mais pas encore vérifié
    if (!result.activetoken) {
      return c.json({ error: "Votre email n’est pas encore vérifié." }, 400);
    }
    const secret_key = process.env.SECRET_KEY;

    if (!secret_key) {
      return c.json(
        { error: "La clé secrète n'est pas définie dans l'environnement" },
        500
      );
    }

    const payload = {
      id: user[0].id,
      email: user[0].email,
      role: "user",
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
    };

    const token = await sign(payload, secret_key);
    setCookie(c, "token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 60 * 5,
    });
    return c.json({ message: "connexion reussi avec succes", user });
  } catch (error) {
    return c.json({ error: "Erreur lors de la connexion" }, 500);
  }
});
app.post("/logout", (c) => {
  try {
    // Supprimer le cookie du token
    deleteCookie(c, "token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
    return c.json({ message: "Déconnexion réussie." });
  } catch (error) {
    return c.json({ error: "Erreur lors de la déconnexion" }, 500);
  }
});
app.use("/tasks/*", async (c, next) => {
  console.log("🔄 Middleware d'authentification exécuté");
  const token = getCookie(c, "token");

  if (!token) {
    return c.json({ error: "Non autorisé : token manquant" }, 401);
  }
  try {
    const secret = process.env.SECRET_KEY || "";
    const payload = await verify(token, secret);

    const userPayload = payload as {
      id: number;
      email: string;
      role: string;
      exp: number;
    };
    c.set("user", userPayload);
    await next();
  } catch (err) {
    console.error("Erreur de vérification du token", err);
    return c.json({ error: "Token invalide" }, 401);
  }
});
app.use("/user", async (c, next) => {
  const token = getCookie(c, "token");

  if (!token) {
    return c.json({ error: "Non autorisé : token manquant" }, 401);
  }
  try {
    const secret = process.env.SECRET_KEY || "";
    const payload = await verify(token, secret);

    const userPayload = payload as {
      id: number;
      email: string;
      role: string;
      exp: number;
    };
    c.set("user", userPayload);
    await next();
  } catch (err) {
    console.error("Erreur de vérification du token", err);
    return c.json({ error: "Token invalide" }, 401);
  }
});

app.use("/projects/*", async (c, next) => {
  const token = getCookie(c, "token");

  if (!token) {
    return c.json({ error: "Non autorisé : token manquant" }, 401);
  }
  try {
    const secret = process.env.SECRET_KEY || "";
    const payload = await verify(token, secret);

    const userPayload = payload as {
      id: number;
      email: string;
      role: string;
      exp: number;
    };
    c.set("user", userPayload);
    await next();
  } catch (err) {
    console.error("Erreur de vérification du token", err);
    return c.json({ error: "Token invalide" }, 401);
  }
});
app.post("/projects", async (c) => {
  const user = c.get("user");
  const { name, description } = await c.req.json();

  try {
    if (!name) {
      return c.json({ error: "Le nom du projet est requis" }, 400);
    }

    const [newProject] = await sql`
      INSERT INTO projects (user_id, name, description) 
      VALUES (${user.id}, ${name}, ${description || ""})
      RETURNING id, name, description
    `;

    return c.json({
      message: "Projet créé avec succès",
      project: newProject,
    });
  } catch (error) {
    return c.json(
      { error: "Erreur lors de la création du projet: " + error },
      500
    );
  }
});

// GET /projects - Récupérer tous les projets d'un utilisateur
app.get("/projects", async (c) => {
  const user = c.get("user");

  try {
    const projects = await sql`
      SELECT id, name, description 
      FROM projects 
      WHERE user_id = ${user.id}
      ORDER BY id DESC
    `;

    return c.json({ projects });
  } catch (error) {
    return c.json(
      { error: "Erreur lors de la récupération des projets: " + error },
      500
    );
  }
});

// GET /projects/:id - Récupérer un projet spécifique par son ID
app.get("/projects/:id", async (c) => {
  const user = c.get("user");
  const projectId = c.req.param("id");

  try {
    const project = await sql`
      SELECT id, name, description 
      FROM projects 
      WHERE id = ${projectId} AND user_id = ${user.id}
    `;

    if (project.length === 0) {
      return c.json({ error: "Projet non trouvé ou non autorisé" }, 404);
    }

    // Récupérer également les tâches associées à ce projet
    const tasks = await sql`
      SELECT id, name, checked, date 
      FROM tasks 
      WHERE project_id = ${projectId} AND user_id = ${user.id}
    `;

    return c.json({
      project: project[0],
      tasks,
    });
  } catch (error) {
    return c.json(
      { error: "Erreur lors de la récupération du projet: " + error },
      500
    );
  }
});
app.get("/tasks", async (c) => {
  const user = c.get("user");
  const projectId = c.req.query("project_id"); // Optionnel: filtrer par projet

  try {
    let tasks;

    if (projectId) {
      // Si un project_id est fourni, récupérer seulement les tâches de ce projet
      tasks = await sql`
        SELECT id, name, checked, date, project_id 
        FROM tasks 
        WHERE user_id=${user.id} AND project_id=${projectId}
      `;
    } else {
      // Sinon récupérer toutes les tâches de l'utilisateur
      tasks = await sql`
        SELECT id, name, checked, date, project_id 
        FROM tasks 
        WHERE user_id=${user.id}
      `;
    }

    const columns = tasks.reduce((acc, task) => {
      const date =
        task.date instanceof Date
          ? task.date.toISOString().split("T")[0]
          : task.date.split("T")[0];
      if (!acc[date]) acc[date] = { id: date, name: date, tasks: [] };
      acc[date].tasks.push({
        id: task.id,
        name: task.name,
        checked: task.checked,
        project_id: task.project_id,
      });
      return acc;
    }, {});

    return c.json({ message: `Bienvenue ${user.email}`, columns });
  } catch (error) {
    return c.json({ error: "Erreur: " + error }, 500);
  }
});

app.get("/user", async (c) => {
  const userData = c.get("user");
  console.log(userData);
  try {
    const [user] =
      await sql`SELECT id, name, email, created_at FROM users WHERE id=${userData.id}`;

    if (!user) {
      return c.json({ error: "Utilisateur non trouvé" }, 404);
    }

    return c.json({ message: `Bienvenue ${userData.email}`, user: [user] });
  } catch (error) {
    return c.json({ error: "voici l'erreur" + error }, 500);
  }
});

app.post("/tasks", async (c) => {
  const user = c.get("user");
  const { name, checked, date, project_id } = await c.req.json();
  const isChecked = checked === "true" || checked === true;

  try {
    // Vérifier si le projet existe et appartient à l'utilisateur
    if (project_id) {
      const project = await sql`
        SELECT id FROM projects WHERE id = ${project_id} AND user_id = ${user.id}
      `;

      if (project.length === 0) {
        return c.json({ error: "Projet non trouvé ou non autorisé" }, 404);
      }
    }

    const [newTask] = await sql`
      INSERT INTO tasks(user_id, name, checked, date, project_id) 
      VALUES (${user.id}, ${name}, ${isChecked}, ${date}, ${project_id || null})
      RETURNING id, name, checked, date, project_id
    `;

    return c.json({
      message: `Tâche ajoutée avec succès`,
      task: newTask,
    });
  } catch (error) {
    return c.json(
      { error: "Erreur lors de l'ajout d'une tâche: " + error },
      500
    );
  }
});
// GET /tasks/:id - Récupérer une tâche spécifique par son ID
app.get("/tasks/:id", async (c) => {
  const user = c.get("user");
  const taskId = c.req.param("id");

  try {
    const task = await sql`
      SELECT id, name, checked, date, project_id FROM tasks 
      WHERE id = ${taskId} AND user_id = ${user.id}
    `;

    if (task.length === 0) {
      return c.json({ error: "Tâche non trouvée ou non autorisée" }, 404);
    }

    return c.json(task[0]);
  } catch (error) {
    return c.json({ error: "Erreur lors de la récupération de la tâche" }, 500);
  }
});
// PUT /tasks/:id - Mettre à jour une tâche existante
app.put("/tasks/:id", async (c) => {
  const user = c.get("user");
  const taskId = c.req.param("id");
  const { name, checked, date, project_id } = await c.req.json();
  const isChecked = checked === true || checked === "true";

  try {
    // Vérifier si la tâche existe et appartient à l'utilisateur
    const existingTask = await sql`
      SELECT id FROM tasks WHERE id = ${taskId} AND user_id = ${user.id}
    `;

    if (existingTask.length === 0) {
      return c.json({ error: "Tâche non trouvée ou non autorisée" }, 404);
    }

    // Si un project_id est fourni, vérifier que le projet existe et appartient à l'utilisateur
    if (project_id) {
      const project = await sql`
        SELECT id FROM projects WHERE id = ${project_id} AND user_id = ${user.id}
      `;

      if (project.length === 0) {
        return c.json({ error: "Projet non trouvé ou non autorisé" }, 404);
      }
    }

    // Mettre à jour la tâche
    const [updatedTask] = await sql`
      UPDATE tasks 
      SET name = ${name}, checked = ${isChecked}, date = ${date}, project_id = ${
      project_id || null
    }
      WHERE id = ${taskId} AND user_id = ${user.id}
      RETURNING id, name, checked, date, project_id
    `;

    return c.json({
      message: "Tâche mise à jour avec succès",
      task: updatedTask,
    });
  } catch (error) {
    return c.json({ error: "Erreur lors de la mise à jour de la tâche" }, 500);
  }
});
app.delete("/tasks/:id", async (c) => {
  const user = c.get("user");
  const taskId = c.req.param("id");
  try {
    console.log(
      `Tentative de suppression de la tâche ${taskId} pour l'utilisateur ${user.id}`
    );

    // Reste du code...
    const task = await sql`
      SELECT id FROM tasks WHERE id = ${taskId} AND user_id = ${user.id}
    `;

    if (task.length === 0) {
      return c.json({ error: "Tâche non trouvée ou non autorisée" }, 404);
    }

    await sql`DELETE FROM tasks WHERE id = ${taskId}`;
    return c.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return c.json(
      {
        error: "Erreur lors de la suppression de la tâche",
      },
      500
    );
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
