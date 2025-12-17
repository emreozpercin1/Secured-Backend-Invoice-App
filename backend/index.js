const express = require("express");
const cors = require("cors");
require('dotenv').config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes/auth.js"));
app.use(require("./routes/invoice.js"));
app.use(require("./routes/customer.js"));
app.set("trust proxy", 1);

app.listen(process.env.BACKEND_PORT, () => {
  console.log("Server running at "+ process.env.BACKEND_PORT);
});
