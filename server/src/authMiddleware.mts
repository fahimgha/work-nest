import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import "dotenv/config";
import type { Context, Next } from "hono";

export async function authMiddleware(c: Context, next: Next) {
  const token = getCookie(c, "token");
  if (!token) return c.json({ error: "Non autorisé : token manquant" }, 401);

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
}
