import * as activitiesRepo from "../repositories/activities.repository.js";

export async function log(userId, verb, entityType, entityId, metadata) {
  await activitiesRepo.create(userId, { verb, entityType, entityId, metadata });
}

export async function listActivities(userId, pagination) {
  return activitiesRepo.list(userId, pagination);
}
