import { body, param, query } from "express-validator";
import { TASK_PRIORITIES } from "../models/Task.js";

const stringArrayTags = () => [
  body("tags").optional().isArray({ max: 20 }).withMessage("tags must be an array with at most 20 items"),
  body("tags.*").isString().withMessage("Each tag must be a string").bail().trim().isLength({ min: 1, max: 40 }).withMessage("Each tag must contain 1 to 40 characters")
];

export const createTaskValidation = [
  body("title").exists().withMessage("Title is required").bail().isString().withMessage("Title must be a string").bail().trim().notEmpty().withMessage("Title cannot be empty").bail().isLength({ max: 120 }).withMessage("Title cannot exceed 120 characters"),
  body("description").optional().isString().withMessage("Description must be a string").bail().trim().isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
  body("completed").optional().isBoolean().withMessage("completed must be true or false"),
  body("priority").optional().isIn(TASK_PRIORITIES).withMessage("priority must be one of: " + TASK_PRIORITIES.join(", ")),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("dueDate must be a valid ISO 8601 date or null"),
  ...stringArrayTags()
];

export const updateTaskValidation = [
  body("title").optional().isString().withMessage("Title must be a string").bail().trim().notEmpty().withMessage("Title cannot be empty").bail().isLength({ max: 120 }).withMessage("Title cannot exceed 120 characters"),
  body("description").optional().isString().withMessage("Description must be a string").bail().trim().isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
  body("completed").optional().isBoolean().withMessage("completed must be true or false"),
  body("priority").optional().isIn(TASK_PRIORITIES).withMessage("priority must be one of: " + TASK_PRIORITIES.join(", ")),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("dueDate must be a valid ISO 8601 date or null"),
  ...stringArrayTags()
];

export const taskIdValidation = [
  param("id").isMongoId().withMessage("id must be a valid MongoDB ObjectId")
];

export const listTasksValidation = [
  query("completed").optional().isIn(["true", "false"]).withMessage("completed must be true or false"),
  query("priority").optional().isIn(TASK_PRIORITIES).withMessage("priority must be one of: " + TASK_PRIORITIES.join(", ")),
  query("tag").optional().isString().trim().isLength({ min: 1, max: 40 }).withMessage("tag must contain 1 to 40 characters"),
  query("search").optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage("search must contain 1 to 100 characters"),
  query("sortBy").optional().isIn(["title", "priority", "dueDate", "createdAt", "updatedAt", "completed"]).withMessage("Unsupported sortBy field"),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("sortOrder must be asc or desc"),
  query("page").optional().isInt({ min: 1, max: 1000000 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be an integer between 1 and 100")
];
