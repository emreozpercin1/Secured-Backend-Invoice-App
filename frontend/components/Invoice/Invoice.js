"use client";
import { useState, useEffect } from "react";
import InvoiceList from "./InvoiceList";
import InvoiceFormModal from "./InvoiceFormModal";
import InvoiceDetailModal from "./InvoiceDetailModal";
import { useAuth } from "@/context/AuthContext";

export default function InvoicePage() {
  const { fetchWithAuth } = useAuth();

  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetchWithAuth(`/api/invoice/list?startdate=2000-01-01&enddate=${today}`);
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
        setFilteredInvoices(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

const handleShowForm = async (invoice = null) => {
  if (!invoice) {
    // Yeni fatura
    setSelectedInvoice(null);
    setShowForm(true);
    return;
  }

  // Düzenleme modunda backend'den detayları çek
  try {
    const res = await fetchWithAuth(`/api/invoice/detail/${invoice.INVOICE_ID}`);
    const data = await res.json();
    if (data.success) {
      setSelectedInvoice(data.data); // items burada var
      setShowForm(true);
    }
  } catch (err) {
    console.error(err);
  }
};


  const handleCloseForm = () => {
    setSelectedInvoice(null);
    setShowForm(false);
  };

  const handleShowDetail = async (invoice) => {
    try {
      const res = await fetchWithAuth(`/api/invoice/detail/${invoice.INVOICE_ID}`);

      const data = await res.json();
      if (data.success) {
        setSelectedInvoice(data.data);
        setShowDetail(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseDetail = () => {
    setSelectedInvoice(null);
    setShowDetail(false);
  };

  return (
    <div className="container mt-4">
      <InvoiceList
        invoices={invoices}
        filteredInvoices={filteredInvoices}
        setFilteredInvoices={setFilteredInvoices}
        fetchInvoices={fetchInvoices}
        onShowForm={handleShowForm}
        onShowDetail={handleShowDetail}
        fetchWithAuth={fetchWithAuth}
      />

      {showForm && (
        <InvoiceFormModal
          invoice={selectedInvoice}
          onClose={handleCloseForm}
          fetchInvoices={fetchInvoices}
          fetchWithAuth={fetchWithAuth}
        />
      )}

      {showDetail && selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
