import React from "react";
import { useNotes } from "../context/NotesContext";
import NoteGrid from "../components/NoteGrid";
import { Archive as ArchiveIcon } from "lucide-react";

const Archive = () => {
  const { notes, searchResults, isSearching } = useNotes();
  
  // Check if there are any archived notes
  const hasArchivedNotes = notes.some(note => note.isArchived && !note.isTrashed);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Archive</h1>
      
      {!hasArchivedNotes ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <ArchiveIcon size={48} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">Your archived notes appear here</h2>
          <p className="text-gray-500 max-w-md">
            Archive notes that you want to keep but don't need right now. Your archived notes won't appear in the Notes section.  
          </p>
        </div>
      ) : (
        <NoteGrid
          filter="archived"
          searchResults={searchResults}
          isSearching={isSearching}
        />
      )}
    </div>
  );
};

export default Archive;
