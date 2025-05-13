import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotesProvider } from "./context/NotesContext.jsx";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import EditNote from "./pages/EditNote";
import Archive from "./pages/Archive";
import Reminders from "./pages/Reminders";
import Labels from "./pages/Labels";
import Trash from "./pages/Trash";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import FloatingActionButton from "./components/FloatingActionButton";
import "./index.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Event listener to close sidebar when clicking outside
    const handleCloseSidebar = () => {
      setIsSidebarOpen(false);
    };

    // Handle responsive behavior
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    document.addEventListener("closeSidebar", handleCloseSidebar);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("closeSidebar", handleCloseSidebar);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <NotesProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                    <div className="flex relative">
                      <Sidebar
                        isOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                      />
                      <main
                        className={`pt-16 w-full transition-all duration-300 min-h-screen px-4 pb-20 ${
                          isSidebarOpen ? "md:ml-64" : "ml-0"
                        }`}
                      >
                        <Routes>
                          <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                          />
                          <Route path="/dashboard" element={<Home />} />
                          <Route path="/reminders" element={<Reminders />} />
                          <Route path="/labels" element={<Labels />} />
                          <Route path="/archive" element={<Archive />} />
                          <Route path="/trash" element={<Trash />} />
                          <Route path="/note/:id" element={<EditNote />} />
                        </Routes>
                      </main>
                    </div>
                    <FloatingActionButton />
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </NotesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
