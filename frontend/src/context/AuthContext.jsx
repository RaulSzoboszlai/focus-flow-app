import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/auth/status");
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "An authentication error occured",
        errors: error.response?.data?.errors || [],
      };
    }
  };

  const register = async (email, password, displayName) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        displayName,
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "An authentication error occured",
        errors: error.response?.data?.errors || [],
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.log("Logout error: ", error);
    }
  };

  return (
    <AuthContext value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext>
  );
}

export const useAuth = () =>  useContext(AuthContext);
