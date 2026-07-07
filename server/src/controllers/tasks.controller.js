import * as tasksService from "../services/tasks.service.js";

export async function list(req, res, next) {
  try {
    const result = await tasksService.listTasks(req.params.id, req.user.id, req.query);
    res.set("Cache-Control", "private, no-cache");
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const task = await tasksService.getTask(req.params.id, req.user.id);
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const task = await tasksService.createTask(req.params.id, req.user.id, req.body);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const task = await tasksService.updateTask(req.params.id, req.user.id, req.body);
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await tasksService.deleteTask(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
