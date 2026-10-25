import mongoose from "mongoose";
import Task from "../models/Task.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const escapeRegex = (value) => value
  .replace(/[.*+?^$()|[\]\\]/g, "\\$&")
  .replace(/[{}]/g, "\\$&");

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ data: task });
});

export const listTasks = asyncHandler(async (req, res) => {
  const {
    completed, priority, tag, search,
    sortBy = "createdAt", sortOrder = "desc"
  } = req.query;
  const page = Number.parseInt(req.query.page ?? "1", 10);
  const limit = Number.parseInt(req.query.limit ?? "10", 10);
  const filter = {};

  if (completed !== undefined) filter.completed = completed === "true";
  if (priority !== undefined) filter.priority = priority;
  if (tag !== undefined) filter.tags = tag.trim();
  if (search !== undefined) {
    const pattern = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(limit).exec(),
    Task.countDocuments(filter).exec()
  ]);

  const totalPages = Math.ceil(total / limit);
  res.json({
    data: tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && total > 0
    },
    filters: {
      completed: completed ?? null,
      priority: priority ?? null,
      tag: tag ?? null,
      search: search ?? null
    },
    sort: { sortBy, sortOrder }
  });
});

export const getTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, "Invalid task ID");
  const task = await Task.findById(req.params.id).exec();
  if (!task) throw new ApiError(404, "Task not found");
  res.json({ data: task });
});

export const updateTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, "Invalid task ID");
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: "query"
  }).exec();
  if (!task) throw new ApiError(404, "Task not found");
  res.json({ data: task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, "Invalid task ID");
  const task = await Task.findByIdAndDelete(req.params.id).exec();
  if (!task) throw new ApiError(404, "Task not found");
  res.json({ message: "Task deleted", id: task._id });
});
