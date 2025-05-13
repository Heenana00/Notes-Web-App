const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middlewares/authMiddleware");

// Protect all todo routes with authentication
router.use(authMiddleware);

// Add a todo item to a note
router.post("/:noteId", async (req, res) => {
  try {
    const { text, completed, position } = req.body;
    const noteId = req.params.noteId;

    // Find the note
    const note = await Note.findById(noteId);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if note belongs to the logged-in user
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this note" });
    }

    // Create new todo item
    const todoItem = {
      text,
      completed: completed || false,
      position: position || note.todoItems.length,
    };

    // Add todo item to note
    note.todoItems.push(todoItem);
    await note.save();

    res.status(201).json({
      success: true,
      todoItem: note.todoItems[note.todoItems.length - 1],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo item
router.put("/:noteId/:todoId", async (req, res) => {
  try {
    const { text, completed, position } = req.body;
    const { noteId, todoId } = req.params;

    // Find the note
    const note = await Note.findById(noteId);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if note belongs to the logged-in user
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this note" });
    }

    // Find the todo item
    const todoItem = note.todoItems.id(todoId);

    // Check if todo item exists
    if (!todoItem) {
      return res.status(404).json({ error: "Todo item not found" });
    }

    // Update todo item
    if (text !== undefined) todoItem.text = text;
    if (completed !== undefined) todoItem.completed = completed;
    if (position !== undefined) todoItem.position = position;

    // Save the note
    await note.save();

    res.status(200).json({
      success: true,
      todoItem,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo item
router.delete("/:noteId/:todoId", async (req, res) => {
  try {
    const { noteId, todoId } = req.params;

    // Find the note
    const note = await Note.findById(noteId);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if note belongs to the logged-in user
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this note" });
    }

    // Find the index of the todo item to remove
    const todoIndex = note.todoItems.findIndex(
      (item) => item._id.toString() === todoId
    );

    // Check if todo item exists
    if (todoIndex === -1) {
      return res.status(404).json({ error: "Todo item not found" });
    }

    // Remove the todo item using splice
    note.todoItems.splice(todoIndex, 1);

    // Save the note
    await note.save();

    res.status(200).json({
      success: true,
      message: "Todo item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
