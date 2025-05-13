import React, { useState, useEffect, useRef } from "react";
import { useNotes } from "../context/NotesContext";
import {
  Palette,
  Tag,
  CheckSquare,
  Bell,
  X,
  Plus,
  Type,
  Calendar,
  AlignLeft,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NoteForm = ({ initialNote, onSave, isExpanded = false }) => {
  const { addNote, updateNote, addTag, removeTag, addTodo, toggleTodo } =
    useNotes();
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [color, setColor] = useState(initialNote?.color || "white");
  const [isPinned, setIsPinned] = useState(initialNote?.isPinned || false);
  const [expanded, setExpanded] = useState(isExpanded);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [tags, setTags] = useState(initialNote?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [todos, setTodos] = useState(initialNote?.todos || []);
  const [newTodo, setNewTodo] = useState("");
  const [showTodoInput, setShowTodoInput] = useState(false);
  const [reminder, setReminder] = useState(initialNote?.reminder);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [useRichText, setUseRichText] = useState(
    (content.includes("<") && content.includes(">")) || true
  );

  const formRef = useRef(null);

  const colors = [
    { name: "default", value: "white" },
    { name: "red", value: "#faafa8" },
    { name: "orange", value: "#fbbc04" },
    { name: "yellow", value: "#fff475" },
    { name: "green", value: "#ccff90" },
    { name: "teal", value: "#a7ffeb" },
    { name: "blue", value: "#cbf0f8" },
    { name: "purple", value: "#d7aefb" },
    { name: "pink", value: "#fdcfe8" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        handleSubmit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title, content, color, isPinned]);

  const handleSubmit = () => {
    if (expanded && (title.trim() || content.trim())) {
      if (initialNote?.id) {
        updateNote(initialNote.id, {
          title,
          content,
          color,
          isPinned,
          tags,
          reminder,
          todos,
        });
      } else {
        addNote({
          title,
          content,
          color,
          isPinned,
          isArchived: false,
          isTrashed: false,
          tags,
          reminder,
          todos,
        });
        setTitle("");
        setContent("");
        setColor("white");
        setIsPinned(false);
        setTags([]);
        setReminder(undefined);
        setTodos([]);
      }

      if (!isExpanded) {
        setExpanded(false);
      }

      if (onSave) {
        onSave();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");

      if (initialNote?.id) {
        addTag(initialNote.id, newTag.trim());
      }
    }
    setShowTagInput(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);

    if (initialNote?.id) {
      removeTag(initialNote.id, tagToRemove);
    }
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
      };

      const updatedTodos = [...todos, newTodoItem];
      setTodos(updatedTodos);
      setNewTodo("");

      if (initialNote?.id) {
        addTodo(initialNote.id, newTodo.trim());
      }
    }
    setShowTodoInput(false);
  };

  const handleToggleTodo = (todoId) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updatedTodos);

    if (initialNote?.id) {
      toggleTodo(initialNote.id, todoId);
    }
  };

  const handleSetReminder = (dateString) => {
    const reminderDate = new Date(dateString);
    setReminder(reminderDate);
    setShowReminderInput(false);
  };

  return (
    <div
      ref={formRef}
      className={`mb-6 mx-auto w-full max-w-2xl rounded-lg border border-gray-200 shadow-sm hover:shadow-md p-5 transition-all duration-300`}
      style={{ backgroundColor: color }}
    >
      {expanded && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-transparent border-none outline-none text-lg font-semibold text-gray-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}

      <div onClick={() => !expanded && setExpanded(true)}>
        {useRichText ? (
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Take a note..."
            className={`bg-transparent ${
              expanded ? "min-h-[100px]" : "min-h-[24px]"
            } focus:outline-none`}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        ) : (
          <textarea
            placeholder="Take a note..."
            className={`w-full bg-transparent border-none outline-none resize-none ${
              expanded ? "min-h-[100px]" : "min-h-[24px]"
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={expanded ? 4 : 1}
          />
        )}
      </div>

      {expanded && (
        <div className="flex flex-col mt-4 pt-3 border-t border-gray-100">
          {/* Tags Section */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm hover:bg-gray-200 transition-colors"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Todos Section */}
          {todos.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-medium mb-2">To-Do Items:</div>
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="mr-2"
                  />
                  <span
                    className={
                      todo.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    {todo.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Reminder Section */}
          {reminder && (
            <div className="flex items-center mb-4 text-sm bg-blue-50 rounded-lg p-3 shadow-sm">
              <Bell size={14} className="mr-2 text-blue-500" />
              <span>
                Reminder:{" "}
                {reminder.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              <button
                onClick={() => setReminder(undefined)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowColorPalette(!showColorPalette)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Change color"
              >
                <Palette size={16} className="text-gray-700" />
              </button>

              <button
                onClick={() => setUseRichText(!useRichText)}
                className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
                  useRichText ? "text-blue-500" : ""
                }`}
                title="Toggle rich text formatting"
              >
                <Type size={16} />
              </button>

              <button
                onClick={() => setShowTagInput(!showTagInput)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Add tag"
              >
                <Tag size={16} className="text-gray-700" />
              </button>

              <button
                onClick={() => setShowTodoInput(!showTodoInput)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Add to-do item"
              >
                <CheckSquare size={16} className="text-gray-700" />
              </button>

              <button
                onClick={() => setShowReminderInput(!showReminderInput)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Set reminder"
              >
                <Bell size={16} className="text-gray-700" />
              </button>

              <button
                onClick={() => setUseRichText(!useRichText)}
                className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
                  useRichText ? "text-blue-500" : ""
                }`}
                title={
                  useRichText ? "Switch to plain text" : "Switch to rich text"
                }
              >
                <span className="font-bold">RT</span>
              </button>

              {showColorPalette && (
                <div className="absolute mt-8 p-2 bg-white rounded-lg shadow-md z-10 flex space-x-1.5">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      className="w-7 h-7 rounded-full border hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: c.value }}
                      onClick={() => {
                        setColor(c.value);
                        setShowColorPalette(false);
                      }}
                      title={c.name}
                    />
                  ))}
                </div>
              )}

              {showTagInput && (
                <div className="absolute mt-8 p-2 bg-white rounded-lg shadow-lg z-10">
                  <div className="flex">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="border rounded-l px-2 py-1 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <button
                      onClick={handleAddTag}
                      className="bg-blue-500 text-white rounded-r px-2 py-1 text-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {showTodoInput && (
                <div className="absolute mt-8 p-2 bg-white rounded-lg shadow-lg z-10">
                  <div className="flex">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Add a to-do item"
                      className="border rounded-l px-2 py-1 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                    />
                    <button
                      onClick={handleAddTodo}
                      className="bg-blue-500 text-white rounded-r px-2 py-1 text-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {showReminderInput && (
                <div className="absolute mt-8 p-2 bg-white rounded-lg shadow-lg z-10">
                  <div className="flex flex-col">
                    <input
                      type="datetime-local"
                      onChange={(e) => handleSetReminder(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!isExpanded) {
                    setExpanded(false);
                    setTitle("");
                    setContent("");
                    setColor("white");
                    setIsPinned(false);
                  } else {
                    onSave && onSave();
                  }
                }}
                className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                {isExpanded ? "Close" : "Discard"}
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors duration-200 text-sm font-medium shadow-sm"
              >
                {initialNote?.id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteForm;
