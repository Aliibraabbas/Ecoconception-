import { verifySupabaseToken } from "../config/supabase.js";
import { UnauthorizedError } from "../utils/errors.js";

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError("Token Bearer manquant");
    }
    const user = await verifySupabaseToken(token);
    req.user = { id: user.id, email: user.email, fullName: user.user_metadata?.full_name };
    next();
  } catch (err) {
    next(new UnauthorizedError("Token invalide ou expiré"));
  }
}
