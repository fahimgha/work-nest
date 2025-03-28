import { serve } from "@hono/node-server";
import { Hono } from "hono";
import bcrypt from "bcryptjs";
import sql from "./db.mts";
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

    const hashedPassword = await bcrypt.hash(password, 12);

    await sql`INSERT INTO users(email,password) VALUES (${email}, ${hashedPassword})`;

    return c.json({ message: "utilisateur crée avec succés " });
  } catch (error) {
    return c.json(
      { error: "Erreur lors de la création de l'utilisateur" },
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
