import { Router } from "express";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "../controllers/taskController.js";
import { onlyAllowedBodyFields, requireAtLeastOneBodyField, validateRequest } from "../middleware/validateRequest.js";
import { createTaskValidation, listTasksValidation, taskIdValidation, updateTaskValidation } from "../validators/taskValidators.js";

const router = Router();
const allowedTaskFields = ["title", "description", "completed", "priority", "dueDate", "tags"];

router.route("/")
  .post(onlyAllowedBodyFields(allowedTaskFields), createTaskValidation, validateRequest, createTask)
  .get(listTasksValidation, validateRequest, listTasks);

router.route("/:id")
  .get(taskIdValidation, validateRequest, getTask)
  .patch(onlyAllowedBodyFields(allowedTaskFields), requireAtLeastOneBodyField, taskIdValidation, updateTaskValidation, validateRequest, updateTask)
  .delete(taskIdValidation, validateRequest, deleteTask);

export default router;
