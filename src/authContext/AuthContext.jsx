import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Create a Context for Authentication
const AuthContext = createContext();

// Custom hook to use the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthContext Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Optional: Store user data if needed

  // Check for stored token on page load
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const storedUser = localStorage.getItem("userData");
    console.log(token, storedUser)
    if (token) {
      setIsAuthenticated(true);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    console.log(userData);
    localStorage.setItem("userToken", userData?.token); // Store token
    localStorage.setItem("userData", JSON.stringify(userData?.user)); // Store user info
    setIsAuthenticated(true);
    setUser(userData?.user);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
