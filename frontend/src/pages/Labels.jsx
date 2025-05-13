import React, { useState } from "react";
import { useNotes } from "../context/NotesContext";
import NoteGrid from "../components/NoteGrid";

const Labels = () => {
  const { notes, searchResults, isSearching } = useNotes();
  const [selectedTag, setSelectedTag] = useState("");

  // Extract all unique tags from notes
  const allTags = new Set();
  notes.forEach((note) => {
    if (note.tags && Array.isArray(note.tags)) {
      note.tags.forEach((tag) => allTags.add(tag));
    }
  });

  const tagsList = Array.from(allTags);

  // Filter notes by selected tag
  const notesByTag = selectedTag
    ? (isSearching ? searchResults : notes).filter(
        (note) =>
          note.tags &&
          note.tags.includes(selectedTag) &&
          !note.isArchived &&
          !note.isTrashed
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Labels</h1>

      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {tagsList.length > 0 ? (
            tagsList.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tag}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No labels found</p>
          )}
        </div>
      </div>

      {selectedTag ? (
        <>
          <h2 className="text-xl font-medium mb-4">
            Notes with label: {selectedTag}
          </h2>
          {notesByTag.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {notesByTag.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                  style={{ backgroundColor: note.color || "white" }}
                  onClick={() => (window.location.href = `/note/${note.id}`)}
                >
                  {note.title && (
                    <h3 className="font-medium mb-2">{note.title}</h3>
                  )}
                  <div className="text-sm text-gray-700 mb-3 overflow-hidden max-h-32">
                    {note.content &&
                    note.content.includes("<") &&
                    note.content.includes(">") ? (
                      <div dangerouslySetInnerHTML={{ __html: note.content }} />
                    ) : (
                      <p>{note.content}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags &&
                      note.tags.map((tag) => (
                        <div
                          key={tag}
                          className="bg-gray-200 rounded-full px-2 py-0.5 text-xs"
                        >
                          <span>{tag}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No notes with this label
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Select a label to view notes
        </div>
      )}
    </div>
  );
};

export default Labels;
