import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(60),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hexadécimale invalide").optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(60).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});
