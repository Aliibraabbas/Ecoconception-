import * as categoriesService from "../services/categories.service.js";

export async function list(req, res, next) {
  try {
    const data = await categoriesService.listCategories(req.user.id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const category = await categoriesService.createCategory(req.user.id, req.body);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const category = await categoriesService.updateCategory(req.params.id, req.user.id, req.body);
    res.json({ category });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await categoriesService.deleteCategory(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
