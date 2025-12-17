"use client";

export default function CustomerSearchBar({ search, setSearch, onAdd }) {
  return (
    <div className="d-flex justify-content-between mb-3">
      <input
        type="text"
        className="form-control w-50"
        placeholder="Müşteri ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="btn btn-success" onClick={onAdd}>
        Yeni Müşteri Ekle
      </button>
    </div>
  );
}
