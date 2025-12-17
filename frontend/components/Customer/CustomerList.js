"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import CustomerSearchBar from "./CustomerSearchBar";
import CustomerTable from "./CustomerTable";
import CustomerFormModal from "./CustomerFormModal";

export default function CustomerList() {
  const { fetchWithAuth } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const fetchCustomers = async () => {
    const res = await fetchWithAuth("/api/customer/list");

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
        setFilteredCustomers(data.data);
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCustomers(customers);
    } else {
      const txt = search.toLowerCase();
      setFilteredCustomers(
        customers.filter((c) =>
          c.TITLE.toLowerCase().includes(txt)
        )
      );
    }
  }, [search, customers]);

  const handleAdd = () => {
    setFormData(null);
    setShowFormModal(true);
  };

  const handleEdit = (c) => {
    setFormData({
      customer_id: c.CUSTOMER_ID,
      tax_number: c.TAX_NUMBER,
      title: c.TITLE,
      address: c.ADDRESS,
      email: c.EMAIL,
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) return;

    const res = await fetchWithAuth(`/api/customer/delete/${id}`, {
      method: "DELETE",
    });

    if (res.ok) fetchCustomers();
  };

  return (
    <div className="container mt-4">

      <CustomerSearchBar search={search} setSearch={setSearch} onAdd={handleAdd} />

      <CustomerTable
        customers={filteredCustomers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showFormModal && (
        <CustomerFormModal
          customer={formData}
          onClose={() => setShowFormModal(false)}
          fetchWithAuth={fetchWithAuth}
          fetchCustomers={fetchCustomers}
        />
      )}
    </div>
  );
}
