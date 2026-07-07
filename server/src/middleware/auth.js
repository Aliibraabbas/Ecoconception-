import { verifySupabaseJwt } from "../config/supabase.js";
import { UnauthorizedError } from "../utils/errors.js";

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError("Token Bearer manquant");
    }
    const payload = await verifySupabaseJwt(token);
    req.user = { id: payload.sub, email: payload.email, fullName: payload.user_metadata?.full_name };
    next();
  } catch (err) {
    next(new UnauthorizedError("Token invalide ou expiré"));
  }
}
