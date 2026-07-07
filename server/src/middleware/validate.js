import { ValidationError } from "../utils/errors.js";

// Valide req[part] (body/query/params) avec un schéma Zod et remplace la valeur par la version parsée.
export function validate(schema, part = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return next(new ValidationError("Données invalides", details));
    }
    req[part] = result.data;
    next();
  };
}
