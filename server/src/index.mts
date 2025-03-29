import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { hash, compare } from "bcryptjs";
import { sign } from "hono/jwt";
import "dotenv/config";
import sql from "./db.mts";
import type { SignatureKey } from "hono/utils/jwt/jws";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

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

    return c.json({ message: "connexion reussi avec succes", token });
  } catch (error) {
    return c.json({ error: "Erreur lors de la connexion" }, 500);
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
