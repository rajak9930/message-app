import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "http://localhost:5000/api/auth/me", 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      }
    } catch (error) {
      console.error("User not authenticated:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", 
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user); 
      navigate("/chat");
      checkUserLoggedIn(); 
    } catch (error) {
        alert("Invalid email or password!");
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
