import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Archive,
  Bell,
  Tag,
  Trash2,
  BookOpen,
  ChevronLeft,
  Edit,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Notes" },
    { path: "/reminders", icon: Bell, label: "Reminders" },
    { path: "/labels", icon: Edit, label: "Edit labels" },
    { path: "/archive", icon: Archive, label: "Archive" },
    { path: "/trash", icon: Trash2, label: "Trash" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() =>
            document.dispatchEvent(new CustomEvent("closeSidebar"))
          }
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-20 h-screen w-64 pt-16 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:fixed md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        <div className="p-4 relative">
          <button
            onClick={toggleSidebar}
            className="absolute right-2 top-2 p-1.5 rounded-full hover:bg-gray-100 md:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
              <BookOpen size={20} className="mr-2 text-yellow-500" /> Keep Notes
            </h2>
            <p className="text-sm text-gray-600">
              Your personal note-taking app
            </p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-r-full transition-colors ${
                  location.pathname === item.path
                    ? "bg-amber-100 text-amber-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon size={18} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
