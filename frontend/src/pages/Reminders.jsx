import React from "react";
import { useNotes } from "../context/NotesContext";
import NoteGrid from "../components/NoteGrid";
import { Bell } from "lucide-react";

const Reminders = () => {
  const { notes, searchResults, isSearching } = useNotes();

  // Filter notes with reminders
  const notesWithReminders = isSearching
    ? searchResults.filter(
        (note) => note.reminder && !note.isArchived && !note.isTrashed
      )
    : notes.filter(
        (note) => note.reminder && !note.isArchived && !note.isTrashed
      );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Reminders</h1>

      {notesWithReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <Bell size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Notes with upcoming reminders appear here
          </h2>
          <p className="text-gray-500 max-w-md">
            Add reminders to notes to get notified at the right time and place.
          </p>
        </div>
      ) : (
        <NoteGrid
          filter="reminders"
          searchResults={searchResults}
          isSearching={isSearching}
        />
      )}
    </div>
  );
};

export default Reminders;
