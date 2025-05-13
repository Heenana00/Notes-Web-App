const mongoose = require("mongoose");

const todoItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    position: { type: Number },
  },
  { _id: true }
);

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: {
      type: Object, // Store Quill Delta JSON directly
      default: { ops: [] },
    },
    contentHtml: { type: String }, // Optional HTML version for easier rendering
    tags: [{ type: String }],
    reminder: { type: Date },
    todoItems: [todoItemSchema], // Embedded to-do checklist items
    isArchived: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    color: { type: String, default: "#ffffff" }, // For note color customization
  },
  { timestamps: true }
);

// Create text index for full-text search
noteSchema.index({ title: "text", contentHtml: "text", tags: "text" });

module.exports = mongoose.model("Note", noteSchema);
