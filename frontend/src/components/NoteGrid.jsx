import React from "react";
import NoteCard from "./NoteCard";
import { useNotes } from "../context/NotesContext.jsx";

const NoteGrid = ({ filter, searchResults = [], isSearching = false }) => {
  const { notes } = useNotes();

  const filteredNotes = isSearching
    ? searchResults.filter((note) => {
        if (filter === "archived") return note.isArchived && !note.isTrashed;
        if (filter === "trash") return note.isTrashed;
        if (filter === "reminders")
          return note.reminder && !note.isArchived && !note.isTrashed;
        return !note.isArchived && !note.isTrashed;
      })
    : notes.filter((note) => {
        if (filter === "archived") return note.isArchived && !note.isTrashed;
        if (filter === "trash") return note.isTrashed;
        if (filter === "reminders")
          return note.reminder && !note.isArchived && !note.isTrashed;
        return !note.isArchived && !note.isTrashed;
      });

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.isPinned);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pinnedNotes.length > 0 && (
          <>
            <div className="col-span-full mb-2">
              <h2 className="text-sm font-medium text-gray-500">PINNED</h2>
            </div>
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
            {unpinnedNotes.length > 0 && (
              <div className="col-span-full my-4">
                <h2 className="text-sm font-medium text-gray-500">OTHERS</h2>
              </div>
            )}
          </>
        )}
        {unpinnedNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
        {filteredNotes.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No notes found
          </div>
        )}
      </div>
    </>
  );
};

export default NoteGrid;
