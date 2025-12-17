"use client";

export default function CustomerTable({ customers, onEdit, onDelete }) {
  if (customers.length === 0)
    return <div className="alert alert-warning">Müşteri bulunamadı.</div>;

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Müşteri No</th>
          <th>Vergi No</th>
          <th>Ünvan / Adı</th>
          <th>Email</th>
          <th>Adres</th>
          <th>İşlemler</th>
        </tr>
      </thead>

      <tbody>
        {customers.map((c) => (
          <tr key={c.CUSTOMER_ID}>
            <td>{c.CUSTOMER_ID}</td>
            <td>{c.TAX_NUMBER}</td>
            <td>{c.TITLE}</td>
            <td>{c.EMAIL}</td>
            <td>{c.ADDRESS}</td>

            <td>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => onEdit(c)}
              >
                Düzenle
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(c.CUSTOMER_ID)}
              >
                Sil
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
