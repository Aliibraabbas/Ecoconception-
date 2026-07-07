import * as tasksRepo from "../repositories/tasks.repository.js";
import * as projectsRepo from "../repositories/projects.repository.js";
import * as categoriesRepo from "../repositories/categories.repository.js";
import * as activities from "./activities.service.js";
import { NotFoundError, ForbiddenError, ValidationError } from "../utils/errors.js";
import { parsePagination, parseSort, buildPaginationMeta } from "../utils/pagination.js";

async function assertOwnedProject(projectId, userId) {
  const project = await projectsRepo.findById(projectId);
  if (!project) throw new NotFoundError("Projet introuvable");
  if (project.ownerId !== userId) throw new ForbiddenError();
  return project;
}

async function assertOwnedTask(id, userId) {
  const task = await tasksRepo.findByIdWithOwner(id);
  if (!task) throw new NotFoundError("Tâche introuvable");
  if (task.ownerId !== userId) throw new ForbiddenError();
  return task;
}

async function assertOwnedCategory(categoryId, userId) {
  if (!categoryId) return;
  const category = await categoriesRepo.findById(categoryId);
  if (!category || category.ownerId !== userId) {
    throw new ValidationError("Données invalides", [
      { field: "categoryId", message: "Catégorie invalide" },
    ]);
  }
}

export async function listTasks(projectId, userId, query) {
  await assertOwnedProject(projectId, userId);
  const { page, limit, offset } = parsePagination(query);
  const sort = parseSort(query.sort, ["due_date", "priority", "position", "created_at"], null);
  const { data, total } = await tasksRepo.list(projectId, {
    status: query.status,
    priority: query.priority,
    categoryId: query.categoryId,
    sort,
    offset,
    limit,
  });
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getTask(id, userId) {
  return assertOwnedTask(id, userId);
}

export async function createTask(projectId, userId, payload) {
  await assertOwnedProject(projectId, userId);
  await assertOwnedCategory(payload.categoryId, userId);
  const position = await tasksRepo.nextPosition(projectId, payload.status || "todo");
  const task = await tasksRepo.create(projectId, { ...payload, position });
  await activities.log(userId, "created", "task", task.id, { title: task.title });
  return task;
}

export async function updateTask(id, userId, payload) {
  const existing = await assertOwnedTask(id, userId);
  await assertOwnedCategory(payload.categoryId, userId);
  const task = await tasksRepo.update(id, payload);
  const verb = payload.status === "done" && existing.status !== "done" ? "completed" : "updated";
  await activities.log(userId, verb, "task", id, { title: task.title });
  return task;
}

export async function deleteTask(id, userId) {
  await assertOwnedTask(id, userId);
  const removed = await tasksRepo.remove(id);
  await activities.log(userId, "deleted", "task", id, {});
  return removed;
}
