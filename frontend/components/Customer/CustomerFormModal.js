"use client";

import { useState, useEffect } from "react";

export default function CustomerFormModal({
  customer,
  onClose,
  fetchCustomers,
  fetchWithAuth,
}) {
  const [taxNumber, setTaxNumber] = useState("");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (customer) {
      setTaxNumber(customer.tax_number || "");
      setTitle(customer.title || "");
      setAddress(customer.address || "");
      setEmail(customer.email || "");
    } else {
      setTaxNumber("");
      setTitle("");
      setAddress("");
      setEmail("");
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = customer ? "PUT" : "POST";
    const url = customer ? "/api/customer/update" : "/api/customer/save";

    const body = customer
      ? {
          customerId: customer.customer_id,
          taxNumber,
          title,
          address,
          email,
        }
      : {
          taxNumber,
          title,
          address,
          email,
        };

    const res = await fetchWithAuth(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      fetchCustomers();
      onClose();
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {customer ? "Müşteri Düzenle" : "Yeni Müşteri"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">

              <div className="mb-3">
                <label className="form-label">Vergi Numarası</label>
                <input
                  type="text"
                  className="form-control"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Ünvan / Adı</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Adres</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Kapat
              </button>

              <button type="submit" className="btn btn-primary">
                {customer ? "Güncelle" : "Kaydet"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
