"use client";

export default function AuthTabs({ tab, setTab }) {
  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item w-50 text-center">
        <button
          className={`nav-link w-100 ${tab === "login" ? "active" : ""}`}
          onClick={() => setTab("login")}
        >
          Giriş Yap
        </button>
      </li>

      <li className="nav-item w-50 text-center">
        <button
          className={`nav-link w-100 ${tab === "register" ? "active" : ""}`}
          onClick={() => setTab("register")}
        >
          Kayıt Ol
        </button>
      </li>
    </ul>
  );
}
