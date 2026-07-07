import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid("Identifiant invalide"),
});
