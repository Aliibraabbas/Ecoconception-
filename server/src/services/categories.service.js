import * as categoriesRepo from "../repositories/categories.repository.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";

async function assertOwnedCategory(id, userId) {
  const category = await categoriesRepo.findById(id);
  if (!category) throw new NotFoundError("Catégorie introuvable");
  if (category.ownerId !== userId) throw new ForbiddenError();
  return category;
}

export function listCategories(userId) {
  return categoriesRepo.list(userId);
}

export function createCategory(userId, payload) {
  return categoriesRepo.create(userId, payload);
}

export async function updateCategory(id, userId, payload) {
  await assertOwnedCategory(id, userId);
  return categoriesRepo.update(id, payload);
}

export async function deleteCategory(id, userId) {
  await assertOwnedCategory(id, userId);
  return categoriesRepo.remove(id);
}

export { assertOwnedCategory };
