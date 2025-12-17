"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Yeni: loading durumu
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setAuthLoading(true);
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (token && username) {
        setLoggedIn(true);
        setUser({ username });
      } else {
        setLoggedIn(false);
        setUser(null);
      }
      setAuthLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      setLoggedIn(true);
      setUser({ username });
      setShowLogin(false);

      return true;
    } catch (err) {
      return false;
    }
  };

  const register = async (username, password) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/register`,
        { username, password },
        { withCredentials: true }
      );

      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Kayıt yapılamadı.",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {}

    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setLoggedIn(false);
    setUser(null);
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const fullUrl = `${API}${url}`;
    try {
      const res = await fetch(fullUrl, { ...options, headers, credentials: "include" });

      if (res.status === 401) {
        const refreshRes = await fetch(`${API}/api/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem("token", data.token);
          headers.Authorization = `Bearer ${data.token}`;
          return await fetch(fullUrl, { ...options, headers, credentials: "include" });
        } else {
          logout();
          return null;
        }
      }

      return res;
    } catch (err) {
      console.error("Fetch with auth error:", err);
      return null;
    }
  };

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        register,
        fetchWithAuth,
        showLogin,
        openLogin,
        closeLogin,
        authLoading, // yeni eklenen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
