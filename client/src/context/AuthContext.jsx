import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user data on load
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, navigate) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Store token
        localStorage.setItem("token", data.token);
        // Store user data from login response
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/dashboard");
        return { success: true };
      } else {
        return { success: false, error: data.msg || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Server error - is the server running?" };
    }
  };

  const register = async (name, email, password, navigate) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        navigate("/login");
        return { success: true };
      } else {
        return { success: false, error: data.msg || "Registration failed" };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Server error - is the server running?" };
    }
  };

  const googleLogin = async (token, userData, navigate) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/dashboard");
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    if (navigate) {
      navigate("/");
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
