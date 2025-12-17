"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm({ tab }) {
  const { login, register } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tab === "login") {
      await login(username, password);
    } else {
      await register(username, password);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Kullanıcı Adı</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Şifre</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 mt-2">
        {tab === "login" ? "Giriş Yap" : "Kayıt Ol"}
      </button>
    </form>
  );
}
