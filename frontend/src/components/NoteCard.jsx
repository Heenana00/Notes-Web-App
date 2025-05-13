import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext.jsx";
import { Tag, Bell, Play, Square, CheckSquare, Calendar } from "lucide-react";
import { Trash2 } from "lucide-react";

const NoteCard = ({ note }) => {
  const navigate = useNavigate();
  const { updateNote, removeNote } = useNotes();
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  const handleTextToSpeech = (e) => {
    e.stopPropagation(); // Prevent card click when clicking the speech button

    if (speechSynthesis && note.content) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        // Extract plain text from HTML content if needed
        let textContent = note.content;
        if (note.content.includes("<") && note.content.includes(">")) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = note.content;
          textContent = tempDiv.textContent || tempDiv.innerText || "";
        }

        const utterance = new SpeechSynthesisUtterance(textContent);

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
        };

        speechSynthesis.cancel(); // Cancel any ongoing speech first
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleClick = () => {
    navigate(`/note/${note.id}`);
  };

  const togglePin = (e) => {
    e.stopPropagation();
    updateNote(note.id, { isPinned: !note.isPinned });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    removeNote(note.id);
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    updateNote(note.id, { isArchived: !note.isArchived });
  };

  // Function to safely render HTML content
  const renderContent = () => {
    if (
      note.content &&
      note.content.includes("<") &&
      note.content.includes(">")
    ) {
      return <div dangerouslySetInnerHTML={{ __html: note.content }} />;
    }
    return <p>{note.content}</p>;
  };

  return (
    <div
      className="rounded-lg border border-gray-200 shadow-sm p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]"
      style={{ backgroundColor: note.color || "white" }}
      onClick={handleClick}
    >
      {note.title && (
        <h3 className="font-semibold mb-3 text-gray-800">{note.title}</h3>
      )}
      <div className="text-sm text-gray-700 mb-4 overflow-hidden max-h-32 leading-relaxed">
        {renderContent()}
      </div>

      <div className="flex space-x-2 mb-3">
        {/* Text-to-Speech Button */}
        <button
          onClick={handleTextToSpeech}
          className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
            isSpeaking ? "text-amber-600 bg-amber-50" : "text-gray-500"
          }`}
          title={isSpeaking ? "Stop Audio" : "Listen to Note"}
        >
          {isSpeaking ? <Square size={16} /> : <Play size={16} />}
        </button>

        {/* Reminder Quick Access */}
        {note.reminder && (
          <button
            className="p-1.5 rounded-full hover:bg-gray-100 text-amber-600 bg-amber-50 shadow-sm"
            title="Reminder Set"
          >
            <Bell size={16} />
          </button>
        )}

        {/* Todo Quick Access */}
        {note.todos && note.todos.length > 0 && (
          <button
            className="p-1.5 rounded-full hover:bg-gray-100 text-green-600 bg-green-50 shadow-sm"
            title="Contains To-Do Items"
          >
            <CheckSquare size={16} />
          </button>
        )}
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {note.tags.map((tag) => (
            <div
              key={tag}
              className="bg-gray-100 rounded-full px-2.5 py-0.5 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}

      {/* Todos */}
      {note.todos && note.todos.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium mb-1">To-Do Items:</div>
          {note.todos.slice(0, 3).map((todo) => (
            <div key={todo.id} className="flex items-center text-xs mb-0.5">
              <span
                className={`w-3 h-3 mr-1 border rounded-sm ${
                  todo.completed
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-400"
                }`}
              />
              <span
                className={todo.completed ? "line-through text-gray-500" : ""}
              >
                {todo.text}
              </span>
            </div>
          ))}
          {note.todos.length > 3 && (
            <div className="text-xs text-gray-500">
              +{note.todos.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Reminder */}
      {note.reminder && (
        <div className="flex items-center text-xs text-amber-600 mb-3 bg-amber-50 px-2.5 py-1.5 rounded-md shadow-sm">
          <Calendar size={12} className="mr-1" />
          <span>
            {new Date(note.reminder).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : ""}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={togglePin}
            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
              note.isPinned ? "text-amber-500" : "text-gray-400"
            }`}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="17" x2="12" y2="22" />
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
            </svg>
          </button>
          <button
            onClick={handleArchive}
            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
              note.isArchived ? "text-blue-500" : "text-gray-400"
            }`}
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-archive"
            >
              <path d="M21 8v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8m16-5H5a2 2 0 0 0-2 2v3h20V5a2 2 0 0 0-2-2z"></path>
              <polyline points="8 12 12 16 16 12"></polyline>
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-red-500"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
