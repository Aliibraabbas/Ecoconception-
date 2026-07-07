import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200),
  description: z.string().max(4000).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  dueDate: z.string().date().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(4000).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  dueDate: z.string().date().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  position: z.number().int().min(0).optional(),
});

export const listTasksQuerySchema = z.object({
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  categoryId: z.string().uuid().optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
