import React, { useState, useRef } from "react";
import { useNotes } from "../context/NotesContext";
import NoteForm from "../components/NoteForm";
import NoteGrid from "../components/NoteGrid";
import FloatingActionButton from "../components/FloatingActionButton";

const Home = () => {
  const { notes, searchResults, isSearching } = useNotes();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  // Filter out archived notes
  const activeNotes = notes.filter((note) => !note.isArchived);

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div ref={formRef}>
        <NoteForm isExpanded={showForm} onSave={() => setShowForm(false)} />
      </div>

      <NoteGrid
        filter=""
        searchResults={searchResults}
        isSearching={isSearching}
      />

      <FloatingActionButton onClick={scrollToForm} />
    </div>
  );
};

export default Home;
