import * as meService from "../services/me.service.js";

export async function getMe(req, res, next) {
  try {
    const profile = await meService.getOrCreateProfile(req.user.id, req.user.fullName);
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const profile = await meService.updateProfile(req.user.id, req.body);
    res.json({ profile });
  } catch (err) {
    next(err);
  }
}
