import jwt from "jsonwebtoken";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "./env.js";

const jwks = env.supabaseUrl
  ? createRemoteJWKSet(new URL(`${env.supabaseUrl}/auth/v1/.well-known/jwks.json`))
  : null;

function decodeHeader(token) {
  const [headerB64] = token.split(".");
  return JSON.parse(Buffer.from(headerB64, "base64").toString("utf8"));
}

// Vérifie le JWT émis par Supabase Auth : HS256 (secret partagé legacy) ou ES256/RS256 (clés JWKS, projets récents).
export async function verifySupabaseJwt(token) {
  const { alg } = decodeHeader(token);

  if (alg === "HS256") {
    if (!env.supabaseJwtSecret) {
      throw new Error(
        "SUPABASE_JWT_SECRET manquant. Renseigne-le dans server/.env (Supabase Dashboard > Project Settings > API > JWT Settings)."
      );
    }
    return jwt.verify(token, env.supabaseJwtSecret, { algorithms: ["HS256"] });
  }

  if (!jwks) {
    throw new Error(
      "SUPABASE_URL manquant. Renseigne-le dans server/.env pour vérifier les JWT signés avec les clés asymétriques Supabase."
    );
  }
  const { payload } = await jwtVerify(token, jwks);
  return payload;
}
