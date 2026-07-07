import * as projectsService from "../services/projects.service.js";

export async function list(req, res, next) {
  try {
    const result = await projectsService.listProjects(req.user.id, req.query);
    res.set("Cache-Control", "private, no-cache");
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const project = await projectsService.getProject(req.params.id, req.user.id);
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const project = await projectsService.createProject(req.user.id, req.body);
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const project = await projectsService.updateProject(req.params.id, req.user.id, req.body);
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await projectsService.deleteProject(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function stats(req, res, next) {
  try {
    const result = await projectsService.getProjectStats(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
