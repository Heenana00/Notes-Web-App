import React, { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([...notes, newNote]);
  };

  const removeNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const updateNote = (noteId, updatedFields) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? { ...note, ...updatedFields, updatedAt: new Date() }
          : note
      )
    );
  };

  const addTag = (noteId, tag) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              tags: [...(note.tags || []), tag],
              updatedAt: new Date(),
            }
          : note
      )
    );
  };

  const removeTag = (noteId, tagToRemove) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              tags: (note.tags || []).filter((tag) => tag !== tagToRemove),
              updatedAt: new Date(),
            }
          : note
      )
    );
  };

  const addTodo = (noteId, todoText) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              todos: [
                ...(note.todos || []),
                {
                  id: Date.now().toString(),
                  text: todoText,
                  completed: false,
                },
              ],
              updatedAt: new Date(),
            }
          : note
      )
    );
  };

  const toggleTodo = (noteId, todoId) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              todos: (note.todos || []).map((todo) =>
                todo.id === todoId
                  ? { ...todo, completed: !todo.completed }
                  : todo
              ),
              updatedAt: new Date(),
            }
          : note
      )
    );
  };

  const searchNotes = (query, tags = []) => {
    setIsSearching(query.trim() !== "" || tags.length > 0);

    if (query.trim() === "" && tags.length === 0) {
      setSearchResults([]);
      return notes;
    }

    const filtered = notes.filter((note) => {
      const matchesQuery =
        query.trim() === "" ||
        note.title?.toLowerCase().includes(query.toLowerCase()) ||
        note.content?.toLowerCase().includes(query.toLowerCase());

      const matchesTags =
        tags.length === 0 || tags.every((tag) => note.tags?.includes(tag));

      return matchesQuery && matchesTags;
    });

    setSearchResults(filtered);
    return filtered;
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        removeNote,
        updateNote,
        addTag,
        removeTag,
        addTodo,
        toggleTodo,
        searchNotes,
        clearSearch,
        searchResults,
        isSearching,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
