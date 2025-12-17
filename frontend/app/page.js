"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/Auth/AuthCard";
import App from "@/components/App";

export default function Home() {
  const { isLoggedIn, authLoading } = useAuth(); // doğru değişken adı authLoading
  const [tab, setTab] = useState("login");

  // authLoading true ise veya isLoggedIn undefined ise loading göster
  if (authLoading || isLoggedIn === undefined) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // isLoggedIn false ise login/register ekranı
  if (!isLoggedIn) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <AuthCard tab={tab} setTab={setTab} />
      </div>
    );
  }

  // isLoggedIn true ise uygulama
  return (
    <div className="vh-100 d-flex flex-column">
      <App />
    </div>
  );
}
