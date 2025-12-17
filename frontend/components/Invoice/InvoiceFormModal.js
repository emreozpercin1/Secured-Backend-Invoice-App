"use client";
import { useState, useEffect } from "react";

export default function InvoiceFormModal({ invoice, onClose, fetchInvoices, fetchWithAuth }) {
  const [customerId, setCustomerId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("Otomatik");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalAmount, setTotalAmount] = useState(0);
  const [items, setItems] = useState([{ ITEM_NAME: "", QUENTITY: 1, PRICE: 0 }]);

  // Düzenle modunda formu doldur
  useEffect(() => {
    setCustomerId(invoice?.CUSTOMER_ID || "");
    setInvoiceNumber(invoice?.INVOICE_NUMBER || "Otomatik");
    setInvoiceDate(invoice?.INVOICE_DATE
      ? new Date(invoice.INVOICE_DATE).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
    );
    setTotalAmount(invoice?.TOTAL_AMOUNT || 0);

    // items direkt backend key’leri ile kullan
    setItems(invoice?.items?.length ? invoice.items : [{ ITEM_NAME: "", QUENTITY: 1, PRICE: 0 }]);
  }, [invoice]);

  // Toplam tutarı otomatik hesapla
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.QUENTITY || 0) * (item.PRICE || 0), 0);
    setTotalAmount(total);
  }, [items]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "QUENTITY" || field === "PRICE" ? Number(value) : value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { ITEM_NAME: "", QUENTITY: 1, PRICE: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { customerId, invoiceDate, items };
    let url = "/api/invoice/save";
    let method = "POST";

    if (invoice?.INVOICE_ID) {
      payload.invoiceId = invoice.INVOICE_ID;
      method = "PUT";
      url = "/api/invoice/update";
    }

    const res = await fetchWithAuth(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      fetchInvoices();
      onClose();
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{invoice ? "Fatura Düzenle" : "Yeni Fatura"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="mb-2">
                <label>Müşteri No</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label>Fatura No</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceNumber}
                  readOnly
                />
              </div>

              <div className="mb-2">
                <label>Tarih</label>
                <input
                  type="date"
                  className="form-control"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Toplam Tutar</label>
                <input
                  type="number"
                  className="form-control"
                  value={totalAmount}
                  readOnly
                />
              </div>

              <hr />
              <h6>Satırlar</h6>
              {items.map((item, index) => (
                <div className="d-flex mb-2" key={index}>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Ürün Adı"
                    value={item.ITEM_NAME}
                    onChange={(e) => handleItemChange(index, "ITEM_NAME", e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Adet"
                    value={item.QUENTITY}
                    onChange={(e) => handleItemChange(index, "QUENTITY", e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Fiyat"
                    value={item.PRICE}
                    onChange={(e) => handleItemChange(index, "PRICE", e.target.value)}
                    required
                  />
                  <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>
                    X
                  </button>
                </div>
              ))}

              <button type="button" className="btn btn-secondary mt-2" onClick={addItem}>
                Yeni Satır Ekle
              </button>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Kapat
              </button>
              <button type="submit" className="btn btn-primary">Kaydet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
