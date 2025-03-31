import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "hono/jwt";
import "dotenv/config";
import sql from "./db.mts";
// import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";

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

app.post("/signup", async (c) => {
  const { email, password } = await c.req.json();
  try {
    if (!email || !password) {
      return c.json({ error: "email et mot de passe sont requis " }, 400);
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

    await sql`INSERT INTO users(email,password) VALUES (${email}, ${hashedPassword})`;

    return c.json({ message: "utilisateur crée avec succés " });
  } catch (error) {
    return c.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      500
    );
  }
});
app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  try {
    if (!email || !password) {
      return c.json({ error: "email et mot de passe sont requis" }, 400);
    }
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      return c.json({ error: "cette utilisateur n'existe pas " }, 400);
    }
    const passwordMatch = await compare(password, user[0].password);
    if (!passwordMatch) {
      return c.json({ error: "mot de passe n'est pas correct" }, 400);
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
    return c.json({ message: "connexion reussi avec succes", token });
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
app.use("/board", async (c, next) => {
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

app.get("/board", async (c) => {
  const user = c.get("user");
  try {
    const board =
      await sql`SELECT id, name, checked, date FROM tasks WHERE user_id=${user.id}`;

    const columns = board.reduce((acc, task) => {
      const date =
        task.date instanceof Date
          ? task.date.toISOString().split("T")[0] // Si c'est un objet Date
          : task.date.split("T")[0];
      if (!acc[date]) acc[date] = { id: date, name: date, tasks: [] };
      acc[date].tasks.push({
        id: task.id,
        name: task.name,
        checked: task.checked,
      });
      return acc;
    }, {});
    console.log(columns);
    return c.json({ message: `Bienvenue ${user.email}`, columns });
  } catch (error) {
    return c.json({ error: "voici l'erreur" + error }, 500);
  }
});

app.get("/user", async (c) => {
  const userData = c.get("user");
  console.log(userData);
  try {
    const user =
      await sql`SELECT id, email, created_at FROM users WHERE id=${userData.id}`;

    console.log(user);
    return c.json({ message: `Bienvenue ${userData.email}`, user });
  } catch (error) {
    return c.json({ error: "voici l'erreur" + error }, 500);
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
