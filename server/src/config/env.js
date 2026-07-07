import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
}

export const env = {
  port: process.env.PORT || 3001,
  databaseUrl: required("DATABASE_URL"),
  supabaseUrl: process.env.SUPABASE_URL || null,
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET || null,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
