import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import NoteForm from "../components/NoteForm";
import { ArrowLeft } from "lucide-react";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes } = useNotes();

  const note = useMemo(() => {
    return notes.find((note) => note.id === id);
  }, [notes, id]);

  if (!note) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p>Note not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go back to notes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back</span>
        </button>
      </div>

      <NoteForm
        initialNote={note}
        isExpanded={true}
        onSave={() => navigate(-1)}
      />
    </div>
  );
};

export default EditNote;
