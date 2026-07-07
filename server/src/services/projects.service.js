import * as projectsRepo from "../repositories/projects.repository.js";
import * as activities from "./activities.service.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { parsePagination, parseSort, buildPaginationMeta } from "../utils/pagination.js";

async function assertOwnedProject(id, userId) {
  const project = await projectsRepo.findById(id);
  if (!project) throw new NotFoundError("Projet introuvable");
  if (project.ownerId !== userId) throw new ForbiddenError();
  return project;
}

export async function listProjects(userId, query) {
  const { page, limit, offset } = parsePagination(query);
  const sort = parseSort(query.sort, ["name", "created_at", "updated_at"], null);
  const { data, total } = await projectsRepo.list(userId, {
    status: query.status,
    q: query.q,
    sort,
    offset,
    limit,
  });
  return { data, pagination: buildPaginationMeta(page, limit, total) };
}

export async function getProject(id, userId) {
  return assertOwnedProject(id, userId);
}

export async function createProject(userId, payload) {
  const project = await projectsRepo.create(userId, payload);
  await activities.log(userId, "created", "project", project.id, { name: project.name });
  return project;
}

export async function updateProject(id, userId, payload) {
  await assertOwnedProject(id, userId);
  const project = await projectsRepo.update(id, payload);
  await activities.log(userId, "updated", "project", id, { name: project.name });
  return project;
}

export async function deleteProject(id, userId) {
  await assertOwnedProject(id, userId);
  const removed = await projectsRepo.remove(id);
  await activities.log(userId, "deleted", "project", id, {});
  return removed;
}

export async function getProjectStats(id, userId) {
  await assertOwnedProject(id, userId);
  return projectsRepo.stats(id);
}
