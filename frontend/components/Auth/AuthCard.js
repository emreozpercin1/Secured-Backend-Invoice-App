"use client";

import AuthTabs from "./AuthTabs";
import AuthForm from "./AuthForm";

export default function AuthCard({ tab, setTab }) {
  return (
    <div className="card shadow-lg p-4" style={{ width: "380px" }}>
      <AuthTabs tab={tab} setTab={setTab} />
      <AuthForm tab={tab} />
    </div>
  );
}
