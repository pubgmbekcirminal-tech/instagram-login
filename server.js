// ============================================
// Vantly — sodda va xavfsiz auth backend shabloni
// ============================================
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-CHANGE-ME";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---- Brute-force hujumlardan himoya ----
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 10,                  // 15 daqiqada maksimum 10 urinish
  message: { message: "Juda ko'p urinish. Keyinroq qayta urinib ko'ring." },
});

// ---- DEMO: xotiradagi foydalanuvchilar bazasi ----
// Ishlab chiqarishda buni PostgreSQL/MongoDB kabi haqiqiy bazaga almashtiring.
const users = [
  {
    id: 1,
    username: "demo",
    // parol: "demo1234" — bcrypt bilan xeshlangan
    passwordHash: bcrypt.hashSync("demo1234", 10),
  },
];

function findUser(username) {
  return users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
}

// ---- Login endpoint ----
app.post("/api/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Barcha maydonlarni to'ldiring." });
  }

  const user = findUser(username);

  // Vaqt asosidagi hujumlarning oldini olish uchun har doim solishtirish bajariladi
  const hashToCompare = user ? user.passwordHash : "$2a$10$invalidhashinvalidhashinvalidhas";
  const isMatch = await bcrypt.compare(password, hashToCompare);

  if (!user || !isMatch) {
    return res.status(401).json({ message: "Login yoki parol noto'g'ri." });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Muvaffaqiyatli kirdingiz.",
    token,
  });
});

// ---- Himoyalangan endpoint namunasi ----
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token topilmadi." });

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token yaroqsiz yoki muddati o'tgan." });
  }
}

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ---- Facebook OAuth joyi (kengaytirish uchun) ----
app.get("/api/auth/facebook", (req, res) => {
  res.status(501).json({ message: "Facebook OAuth hali sozlanmagan." });
});

app.listen(PORT, () => {
  console.log(`Vantly server ${PORT}-portda ishga tushdi: http://localhost:${PORT}`);
});
