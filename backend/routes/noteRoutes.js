const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getUserTags,
  getNoteTextContent,
} = require("../controllers/noteController");
const authMiddleware = require("../middlewares/authMiddleware");

// Protect all note routes with authentication
router.use(authMiddleware);

// Note CRUD operations
router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

// Tags management
router.get("/tags/all", getUserTags);

// Text-to-speech support
router.get("/:id/text-content", getNoteTextContent);

module.exports = router;
