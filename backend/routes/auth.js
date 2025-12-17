const express = require("express");
const router = express.Router();
const db = require("../data/sql.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_LIFETIME = 30;

router.use(cookieParser());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Çok fazla deneme. Lütfen sonra tekrar deneyin.",
});

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.USER_ID, username: user.USER_NAME },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.USER_ID, username: user.USER_NAME },
    JWT_REFRESH_SECRET,
    { expiresIn: `${REFRESH_LIFETIME}d` }
  );
};

router.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({ message: "Kullanıcı adı en az 3 karakter olmalıdır." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Şifre en az 6 karakter olmalıdır." });
    }

    const exists = await db.mysql_get(
      "SELECT * FROM USERS WHERE USER_NAME = ?",
      [username]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "Bu kullanıcı adı zaten kullanılıyor." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.mysql_set(
      "INSERT INTO USERS (USER_NAME, PASSWORD) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.json({ message: "Kayıt başarılı." });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

router.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await db.mysql_get(
      "SELECT * FROM USERS WHERE USER_NAME = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!isMatch) {
      return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await db.mysql_set(
      "INSERT INTO REFRESH_TOKENS (USER_ID, TOKEN) VALUES (?, ?)",
      [user.USER_ID, refreshToken]
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: REFRESH_LIFETIME * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Giriş başarılı.",
      token: accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

router.post("/api/auth/refresh-token", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token bulunamadı." });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    const tokens = await db.mysql_get(
      "SELECT * FROM REFRESH_TOKENS WHERE USER_ID = ? AND TOKEN = ?",
      [decoded.userId, token]
    );

    if (tokens.length === 0) {
      return res.status(403).json({ message: "Refresh token geçersiz." });
    }

    const users = await db.mysql_get(
      "SELECT * FROM USERS WHERE USER_ID = ?",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const user = users[0];

    const newAccessToken = generateAccessToken(user);

    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Token doğrulanamadı." });
  }
});

router.post("/api/auth/logout", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

      await db.mysql_set(
        "DELETE FROM REFRESH_TOKENS WHERE USER_ID = ? AND TOKEN = ?",
        [decoded.userId, token]
      );
    } catch (err) {}
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  });

  res.json({ message: "Çıkış yapıldı." });
});

router.get("/api/auth/auth", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token bulunamadı." });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ message: "OK" });
  } catch (err) {
    res.status(403).json({ message: "Geçersiz token." });
  }
});

module.exports = router;
