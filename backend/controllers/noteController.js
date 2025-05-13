const Note = require("../models/Note");
const mongoose = require("mongoose");

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const {
      title,
      content,
      contentHtml,
      tags,
      reminder,
      todoItems,
      isPinned,
      isArchived,
      color,
    } = req.body;

    // Create note with user ID from auth middleware
    const note = await Note.create({
      userId: req.user.id,
      title,
      content: content || { ops: [] },
      contentHtml,
      tags: tags || [],
      reminder: reminder || null,
      todoItems: todoItems || [],
      isPinned: isPinned || false,
      isArchived: isArchived || false,
      color: color || "#ffffff",
    });

    res.status(201).json({
      success: true,
      note,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notes for the logged-in user
exports.getNotes = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { tag, search, hasReminder, isPinned, isArchived } = req.query;

    // Base query - only get notes for the logged-in user
    const query = { userId: req.user.id };

    // Add tag filter if provided
    if (tag) {
      query.tags = tag;
    }

    // Add reminder filter if provided
    if (hasReminder === "true") {
      query.reminder = { $ne: null };
    }

    // Add pinned filter if provided
    if (isPinned !== undefined) {
      query.isPinned = isPinned === "true";
    }

    // Add archived filter if provided
    if (isArchived !== undefined) {
      query.isArchived = isArchived === "true";
    } else {
      // By default, don't show archived notes unless specifically requested
      query.isArchived = false;
    }

    // Add search filter if provided
    if (search) {
      // Use text index for full-text search if available
      if (search.length > 3) {
        query.$text = { $search: search };
      } else {
        // For shorter search terms, use regex
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { contentHtml: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ];
      }
    }

    // Sort by pinned first, then by updated date
    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if note belongs to the logged-in user
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this note" });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const {
      title,
      content,
      contentHtml,
      tags,
      reminder,
      todoItems,
      isPinned,
      isArchived,
      color,
    } = req.body;

    // Find note by ID
    let note = await Note.findById(req.params.id);

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

    // Prepare update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (contentHtml !== undefined) updateData.contentHtml = contentHtml;
    if (tags !== undefined) updateData.tags = tags;
    if (reminder !== undefined) updateData.reminder = reminder;
    if (todoItems !== undefined) updateData.todoItems = todoItems;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (isArchived !== undefined) updateData.isArchived = isArchived;
    if (color !== undefined) updateData.color = color;
    updateData.updatedAt = Date.now();

    // Update note
    note = await Note.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      note,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    // Find note by ID
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if note belongs to the logged-in user
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this note" });
    }

    // Delete note
    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unique tags for the logged-in user
exports.getUserTags = async (req, res) => {
  try {
    // Use MongoDB aggregation to get unique tags efficiently
    const result = await Note.aggregate([
      // Match only notes for the current user
      { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
      // Unwind the tags array to get one document per tag
      { $unwind: "$tags" },
      // Group by tag and count occurrences
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      // Sort by count descending
      { $sort: { count: -1 } },
      // Project to rename fields
      { $project: { _id: 0, name: "$_id", count: 1 } },
    ]);

    res.status(200).json({
      success: true,
      count: result.length,
      tags: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get clean text content for text-to-speech
exports.getNoteTextContent = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Check if note belongs to the logged-in user
    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this note" });
    }

    // Extract clean text from the rich text content
    let cleanText = "";

    // If contentHtml is available, use it for text extraction
    if (note.contentHtml) {
      cleanText = note.contentHtml
        .replace(/<[^>]*>/g, " ") // Remove HTML tags
        .replace(/&nbsp;/g, " ") // Replace HTML entities
        .replace(/&lt;/g, "<") // Replace HTML entities
        .replace(/&gt;/g, ">") // Replace HTML entities
        .replace(/&amp;/g, "&") // Replace HTML entities
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim(); // Trim whitespace
    }
    // If Delta JSON is available, extract text from it
    else if (note.content && note.content.ops) {
      // Extract text from Quill Delta format
      cleanText = note.content.ops
        .map((op) => {
          if (typeof op.insert === "string") {
            return op.insert;
          }
          return "";
        })
        .join("")
        .trim();
    } else if (typeof note.content === "string") {
      // Fallback for string content
      cleanText = note.content
        .replace(/<[^>]*>/g, " ") // Remove HTML tags if any
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim(); // Trim whitespace
    }

    // Add title at the beginning
    cleanText = `${note.title}. ${cleanText}`;

    // Add todo items if they exist
    if (note.todoItems && note.todoItems.length > 0) {
      const todoText = note.todoItems
        .map(
          (item) => `${item.completed ? "Completed: " : "Todo: "} ${item.text}`
        )
        .join(". ");

      cleanText += `. Todo list: ${todoText}`;
    }

    res.status(200).json({
      success: true,
      noteId: note._id,
      title: note.title,
      textContent: cleanText,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
