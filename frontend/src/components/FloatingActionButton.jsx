import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import NoteForm from "./NoteForm";

const FloatingActionButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="fixed right-6 bottom-6 z-40">
      {isFormOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden mb-4">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Add Note</h3>
              <button
                onClick={toggleForm}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <NoteForm onSave={toggleForm} />
          </div>
        </div>
      )}
      <button
        onClick={toggleForm}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
        aria-label="Add note"
      >
        {isFormOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};

export default FloatingActionButton;
