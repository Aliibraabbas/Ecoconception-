import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(120),
  description: z.string().max(2000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hexadécimale invalide").optional(),
  coverImageUrl: z.string().url().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  coverImageUrl: z.string().url().optional(),
  status: z.enum(["active", "archived"]).optional(),
});

export const listProjectsQuerySchema = z.object({
  status: z.enum(["active", "archived"]).optional(),
  q: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
