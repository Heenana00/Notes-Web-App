import React, { useState } from "react";
import { Menu, Search, LogOut, X, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotes } from "../context/NotesContext.jsx";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useAuth();
  const { searchNotes, clearSearch } = useNotes();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      searchNotes(value);
    } else {
      clearSearch();
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30 h-16">
      <div className="h-full flex items-center justify-between px-2 md:px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 mr-2 text-gray-700"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-bold text-gray-800">Keep Notes</h1>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes"
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm transition-all duration-200 hover:bg-white focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors duration-200"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 flex items-center text-gray-700 transition-colors duration-200"
            aria-label="Logout"
          >
            <LogOut size={20} />
            <span className="ml-2 hidden md:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
