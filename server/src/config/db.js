import pg from "pg";
import { env } from "./env.js";

const { Pool, types } = pg;

// OID 1082 = date. Le parseur par défaut de node-postgres renvoie un objet Date en heure locale,
// ce qui décale la valeur d'un jour une fois sérialisé en UTC. Une colonne DATE n'a pas de fuseau :
// on garde la chaîne "YYYY-MM-DD" telle quelle.
types.setTypeParser(1082, (value) => value);

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
});

export const query = (text, params) => pool.query(text, params);
