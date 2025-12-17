"use client";
import { useState, useEffect } from "react";

export default function InvoiceList({
  invoices,
  filteredInvoices,
  setFilteredInvoices,
  fetchInvoices,
  onShowDetail,
  onShowForm,
  fetchWithAuth,
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim()) {
        setFilteredInvoices(invoices);
      } else {
        setFilteredInvoices(
          invoices.filter(
            (inv) =>
              inv.INVOICE_NUMBER.toLowerCase().includes(search.toLowerCase()) ||
              inv.CUSTOMER_TITLE.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, invoices]);

  const handleDelete = async (invoiceId) => {
    if (!confirm("Faturayı silmek istediğine emin misin?")) return;
    const res = await fetchWithAuth(`/api/invoice/delete/${invoiceId}`, {
      method: "DELETE",
    });
    if (res.ok) fetchInvoices();
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <input
          type="text"
          placeholder="Ara..."
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => onShowForm()}>
          Yeni Fatura Ekle
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Fatura No</th>
            <th>Müşteri</th>
            <th>Tarih</th>
            <th>Toplam</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                Fatura bulunamadı.
              </td>
            </tr>
          ) : (
            filteredInvoices.map((inv) => (
              <tr key={inv.INVOICE_ID}>
                <td>{inv.INVOICE_NUMBER}</td>
                <td>{inv.CUSTOMER_TITLE}</td>
                <td>{new Date(inv.INVOICE_DATE).toLocaleDateString("tr-TR")}</td>
                <td>{inv.TOTAL_AMOUNT}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-1"
                    onClick={() => onShowDetail(inv)}
                  >
                    Görüntüle
                  </button>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => onShowForm(inv)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(inv.INVOICE_ID)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
