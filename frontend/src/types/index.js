// Note object structure
export const noteStructure = {
  id: "",
  title: "",
  content: "",
  color: "",
  isPinned: false,
  isArchived: false,
  isTrashed: false,
  tags: [],
  reminder: null,
  todos: [],
  createdAt: 0,
  updatedAt: 0,
};

// Todo object structure
export const todoStructure = {
  id: "",
  text: "",
  completed: false,
};

// These structures serve as documentation for the shape of objects
// used throughout the application. They replace TypeScript interfaces.
