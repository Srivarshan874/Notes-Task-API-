import mongoose from "mongoose";

export const TASK_PRIORITIES = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [120, "Title cannot exceed 120 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: ""
    },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: TASK_PRIORITIES, default: "medium" },
    dueDate: { type: Date, default: null },
    tags: {
      type: [{ type: String, trim: true, maxlength: [40, "Each tag cannot exceed 40 characters"] }],
      default: []
    }
  },
  { timestamps: true, versionKey: false }
);

taskSchema.index({ completed: 1, createdAt: -1 });
taskSchema.index({ priority: 1, createdAt: -1 });

export default mongoose.model("Task", taskSchema);
