import React, { useState, useEffect } from "react";
import { useNotes } from "../context/NotesContext.jsx";
import { Search, Tag, X } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const { notes, searchNotes } = useNotes();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  useEffect(() => {
    const allTags = new Set();
    notes.forEach((note) => {
      if (note.tags) {
        note.tags.forEach((tag) => allTags.add(tag));
      }
    });
    setAvailableTags(Array.from(allTags));
  }, [notes]);

  useEffect(() => {
    const results = searchNotes(query, selectedTags);
    onSearch(results);
  }, [query, selectedTags, searchNotes, onSearch]);

  const handleAddTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="mb-6">
      <div className="flex items-center bg-white rounded-lg shadow-sm border p-2">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search notes..."
          className="flex-grow outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => setShowTagDropdown(!showTagDropdown)}
          className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors ${
            selectedTags.length > 0 ? "text-blue-500" : ""
          }`}
          title="Filter by tags"
        >
          <Tag size={18} />
        </button>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showTagDropdown && availableTags.length > 0 && (
        <div className="absolute mt-1 p-2 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {availableTags
            .filter((tag) => !selectedTags.includes(tag))
            .map((tag) => (
              <div
                key={tag}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => handleAddTag(tag)}
              >
                {tag}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
