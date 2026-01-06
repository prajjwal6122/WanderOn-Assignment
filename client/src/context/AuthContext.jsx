import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Configure axios defaults
axios.defaults.baseURL = "https://wanderon-assignment-1-ik4q.onrender.com";
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      setError(null);
      const response = await axios.post("/api/auth/login", {
        identifier,
        password,
      });

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      // Handle validation errors with detailed field information
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = validationErrors
          .map((e) => `${e.field}: ${e.message}`)
          .join(" | ");
        setError(errorMessages);
        return {
          success: false,
          message: errorMessages,
          errors: validationErrors,
        };
      }
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post("/api/auth/register", userData);

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      // Handle validation errors with detailed field information
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = validationErrors
          .map((e) => `${e.field}: ${e.message}`)
          .join(" | ");
        setError(errorMessages);
        return {
          success: false,
          message: errorMessages,
          errors: validationErrors,
        };
      }
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/auth/logout");
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      setError(null);
      const response = await axios.put("/api/auth/updateprofile", data);

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      // Handle validation errors with detailed field information
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = validationErrors
          .map((e) => `${e.field}: ${e.message}`)
          .join(" | ");
        setError(errorMessages);
        return {
          success: false,
          message: errorMessages,
          errors: validationErrors,
        };
      }
      const message = err.response?.data?.message || "Update failed";
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
