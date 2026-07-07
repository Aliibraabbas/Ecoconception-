import { z } from "zod";

export const updateMeSchema = z.object({
  fullName: z.string().min(1).max(120).optional(),
  avatarUrl: z.string().url().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  locale: z.string().min(2).max(10).optional(),
});
