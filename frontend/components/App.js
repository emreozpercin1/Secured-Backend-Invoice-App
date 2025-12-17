"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import InvoiceList from "./Invoice/Invoice";
import CustomerList from "./Customer/Customer";

export default function PanelTabs({ fetchWithAuth }) {
  const [activeTab, setActiveTab] = useState("invoices");
  const { user, logout } = useAuth(); 

  return (
    <div>
      
      {/* TAB BUTTONS */}
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom">
        {/* Tablar */}
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "invoices" ? "active" : ""}`}
              onClick={() => setActiveTab("invoices")}
            >
              Fatura Listesi
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "customers" ? "active" : ""}`}
              onClick={() => setActiveTab("customers")}
            >
              Müşteri Listesi
            </button>
          </li>
        </ul>

        {/* Kullanıcı bilgisi ve çıkış */}
        <div className="d-flex align-items-center gap-2">
          <span>{user.username}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={logout}>
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "invoices" && <InvoiceList fetchWithAuth={fetchWithAuth} />}
        {activeTab === "customers" && <CustomerList fetchWithAuth={fetchWithAuth} />}
      </div>
    </div>
  );
}
