"use client";
export default function InvoiceDetailModal({ invoice, onClose }) {
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Fatura Detayı</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Fatura No:</strong> {invoice.INVOICE_NUMBER}</p>
            <p><strong>Müşteri:</strong> {invoice.CUSTOMER_TITLE}</p>
            <p>
              <strong>Tarih:</strong>{" "}
              {new Date(invoice.INVOICE_DATE).toLocaleDateString("tr-TR")}
            </p>
            <p><strong>Toplam:</strong> {invoice.TOTAL_AMOUNT}</p>

            {invoice.items && invoice.items.length > 0 && (
              <>
                <h6>Ürünler</h6>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Adet</th>
                      <th>Fiyat</th>
                      <th>Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ITEM_NAME}</td>
                        <td>{item.QUENTITY}</td>
                        <td>{item.PRICE}</td>
                        <td>{item.QUENTITY * item.PRICE}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Kapat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
