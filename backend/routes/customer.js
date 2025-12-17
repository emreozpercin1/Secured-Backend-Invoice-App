const express = require("express");
const router = express.Router();
const { mysql_get, mysql_set } = require("../data/sql");
const { checkAuth } = require("../functions/middleware");

router.get("/api/customer/list", checkAuth, async (req, res) => {
  try {
    const query = `SELECT * FROM CUSTOMER WHERE USER_ID = ? ORDER BY RECORD_DATE DESC`;
    const rows = await mysql_get(query, [req.user.userId]);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Müşteri listesi alınamadı" });
  }
});

router.post("/api/customer/save", checkAuth, async (req, res) => {
  const { taxNumber, title, address, email } = req.body;
  try {
    const query = `INSERT INTO CUSTOMER (TAX_NUMBER, TITLE, ADDRESS, EMAIL, USER_ID) VALUES (?, ?, ?, ?, ?)`;
    const result = await mysql_set(query, [taxNumber, title, address, email, req.user.userId]);
    return res.json({ success: true, message: "Müşteri başarıyla eklendi", customerId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Müşteri eklenemedi" });
  }
});

router.put("/api/customer/update", checkAuth, async (req, res) => {
  const { customerId, taxNumber, title, address, email } = req.body;
  try {
    const query = `UPDATE CUSTOMER SET TAX_NUMBER=?, TITLE=?, ADDRESS=?, EMAIL=? WHERE CUSTOMER_ID=? AND USER_ID=?`;
    await mysql_set(query, [taxNumber, title, address, email, customerId, req.user.userId]);
    return res.json({ success: true, message: "Müşteri güncellendi" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Müşteri güncellenemedi" });
  }
});

router.delete("/api/customer/delete/:customerId", checkAuth, async (req, res) => {
  const { customerId } = req.params;
  try {
    const query = `DELETE FROM CUSTOMER WHERE CUSTOMER_ID=? AND USER_ID=?`;
    await mysql_set(query, [customerId, req.user.userId]);
    return res.json({ success: true, message: "Müşteri silindi" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Müşteri silinemedi" });
  }
});

module.exports = router;
