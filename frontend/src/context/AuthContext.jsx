import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    // Implement login logic here
    setUser({ email });
    setIsAuthenticated(true);
    // Redirection will be handled in the Login component
  };

  const register = (email, password) => {
    // Implement registration logic here
    setUser({ email });
    setIsAuthenticated(true);
    // Redirection will be handled in the Register component
  };

  const logout = () => {
    // Implement logout logic here
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
