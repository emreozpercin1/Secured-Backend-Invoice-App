const express = require("express");
const router = express.Router();
const { mysql_get, mysql_set } = require("../data/sql");
const { checkAuth } = require("../functions/middleware");

// Yeni fatura ekleme
router.post("/api/invoice/save", checkAuth, async (req, res) => {
  const { customerId, invoiceDate, items } = req.body;
  const userId = req.user.userId;

  if (!customerId || !items || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "Eksik veya hatalı veriler" });
  }

  const generatedInvoiceNumber = "FAT-" + Date.now();
  const invoiceDateValue = invoiceDate || new Date();
  const totalAmount = items.reduce((sum, i) => sum + (i.QUENTITY || 0) * (i.PRICE || 0), 0);

  try {
    const invoiceQuery = `
      INSERT INTO INVOICE (CUSTOMER_ID, INVOICE_NUMBER, INVOICE_DATE, TOTAL_AMOUNT, USER_ID)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await mysql_set(invoiceQuery, [
      customerId,
      generatedInvoiceNumber,
      invoiceDateValue,
      totalAmount,
      userId
    ]);

    const invoiceId = result.insertId;

    const lineQuery = `
      INSERT INTO INVOICE_LINE (INVOICE_ID, ITEM_NAME, QUENTITY, PRICE, USER_ID)
      VALUES (?, ?, ?, ?, ?)
    `;
    for (const item of items) {
      await mysql_set(lineQuery, [
        invoiceId,
        item.ITEM_NAME || "",
        item.QUENTITY != null ? item.QUENTITY : 0,
        item.PRICE != null ? item.PRICE : 0,
        userId
      ]);
    }

    res.json({ success: true, message: "Fatura kaydedildi", invoiceId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fatura kaydedilemedi", error: err.message });
  }
});

// Fatura güncelleme
router.put("/api/invoice/update", checkAuth, async (req, res) => {
  const { invoiceId, customerId, invoiceDate, items } = req.body;
  const userId = req.user.userId;

  if (!invoiceId || !customerId || !items || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "Eksik veya hatalı veriler" });
  }

  const totalAmount = items.reduce((sum, i) => sum + (i.QUANTITY || 0) * (i.PRICE || 0), 0);

  try {
    // Fatura güncelle
    await mysql_set(
      `UPDATE INVOICE SET CUSTOMER_ID=?, INVOICE_DATE=?, TOTAL_AMOUNT=?, USER_ID=? WHERE INVOICE_ID=?`,
      [customerId, invoiceDate || new Date(), totalAmount, userId, invoiceId]
    );

    // Önce eski satırları sil
    await mysql_set(`DELETE FROM INVOICE_LINE WHERE INVOICE_ID=?`, [invoiceId]);

    // Yeni satırları ekle
    const insertLineQuery = `
      INSERT INTO INVOICE_LINE (INVOICE_ID, ITEM_NAME, QUENTITY, PRICE, USER_ID)
      VALUES (?, ?, ?, ?, ?)
    `;
    for (const item of items) {
      await mysql_set(insertLineQuery, [
        invoiceId,
        item.ITEM_NAME || "",
        item.QUANTITY != null ? item.QUANTITY : 0,
        item.PRICE != null ? item.PRICE : 0,
        userId
      ]);
    }

    res.json({ success: true, message: "Fatura güncellendi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fatura güncellenemedi", error: err.message });
  }
});

// Fatura silme
router.delete("/api/invoice/delete/:invoiceId", checkAuth, async (req, res) => {
  const { invoiceId } = req.params;
  const userId = req.user.userId;

  if (!invoiceId) return res.status(400).json({ success: false, message: "Fatura ID gerekli" });

  try {
    await mysql_set(`DELETE FROM INVOICE_LINE WHERE INVOICE_ID=?`, [invoiceId]);
    await mysql_set(`DELETE FROM INVOICE WHERE INVOICE_ID=? AND USER_ID=?`, [invoiceId, userId]);
    res.json({ success: true, message: "Fatura silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fatura silinemedi", error: err.message });
  }
});

// Tüm fatura listesi (filtre ve sayfalama yok)
router.get("/api/invoice/list", checkAuth, async (req, res) => {
  try {
    const rows = await mysql_get(`
      SELECT I.*, C.TITLE AS CUSTOMER_TITLE
      FROM INVOICE I
      LEFT JOIN CUSTOMER C ON C.CUSTOMER_ID = I.CUSTOMER_ID
      ORDER BY I.INVOICE_DATE DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fatura listesi alınamadı", error: err.message });
  }
});

// Fatura detay
router.get("/api/invoice/detail/:invoiceId", checkAuth, async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const invoiceRows = await mysql_get(
      `SELECT I.*, C.TITLE AS CUSTOMER_TITLE FROM INVOICE I
       LEFT JOIN CUSTOMER C ON C.CUSTOMER_ID = I.CUSTOMER_ID
       WHERE I.INVOICE_ID = ?`,
      [invoiceId]
    );

    if (!invoiceRows.length)
      return res.status(404).json({ success: false, message: "Invoice not found" });

    const invoice = invoiceRows[0];

    const items = await mysql_get(`SELECT * FROM INVOICE_LINE WHERE INVOICE_ID=?`, [invoiceId]);
    invoice.items = items;

    res.json({ success: true, data: invoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Invoice detail fetch failed" });
  }
});

module.exports = router;
