"use client";
import { useState } from "react";
import InvoiceDetailModal from "./InvoiceDetailModal";
import { useAuth } from "@/context/AuthContext";

export default function InvoiceItem({ invoice, refresh }) {
  const { fetchWithAuth } = useAuth();
  const [show, setShow] = useState(false);

  const handleDelete = async () => {
    if(confirm("Bu faturayı silmek istediğinize emin misiniz?")) {
      await fetchWithAuth(`/api/invoice/delete/${invoice.INVOICE_ID}`, { method: "DELETE" });
      refresh();
    }
  };

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>{invoice.CUSTOMER_TITLE}</strong> - {invoice.INVOICE_NUMBER} ({invoice.TOTAL_AMOUNT}₺)
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-sm btn-info" onClick={() => setShow(true)}>İçeriği Gör</button>
        <button className="btn btn-sm btn-warning">Güncelle</button>
        <button className="btn btn-sm btn-danger" onClick={handleDelete}>Sil</button>
      </div>
      {show && <InvoiceDetailModal invoice={invoice} onClose={() => setShow(false)} />}
    </div>
  );
}
