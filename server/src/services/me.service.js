import * as profilesRepo from "../repositories/profiles.repository.js";

export async function getOrCreateProfile(userId, fullName) {
  const existing = await profilesRepo.findById(userId);
  if (existing) return existing;
  return profilesRepo.upsert(userId, { fullName });
}

export async function updateProfile(userId, updates) {
  await getOrCreateProfile(userId);
  return profilesRepo.update(userId, updates);
}
