import React, { createContext, useContext, useState, useEffect } from "react";
import socket from "../socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Emit user online when user logs in
  useEffect(() => {
    if (user && user._id) {
      socket.emit("user_online", user._id);
    }
  }, [user]);

  const login = async (token, userData, navigate) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    // Emit online status
    if (userData._id) {
      socket.emit("user_online", userData._id);
    }
    
    navigate("/dashboard");
  };

  const register = async (token, userData, navigate) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    // Emit online status
    if (userData._id) {
      socket.emit("user_online", userData._id);
    }
    
    navigate("/dashboard");
  };

  const logout = (navigate) => {
    // Emit offline status before logging out
    if (user && user._id) {
      socket.emit("user_offline", user._id);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    
    if (navigate) {
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
