import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent. Please try again later." },
  skip: () => process.env.NODE_ENV === "test",
});

const app = express();

// On Render the app sits behind a proxy. Without this, every request looks like it comes
// from the proxy's own address, so all visitors would share a single rate-limit allowance.
// TRUST_PROXY_HOPS is how many proxies stand between the internet and this app (Render: 1).
const proxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 1);
app.set("trust proxy", Number.isInteger(proxyHops) && proxyHops >= 0 ? proxyHops : 1);

app.use(cors({ origin: CLIENT_URL }));
// A message tops out at 5000 characters, so 32kb leaves room for JSON overhead and
// multi-byte text while refusing anything bigger than a real form could send.
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);

// Bodies the JSON parser refuses (too big, not valid JSON) get a plain JSON answer
// instead of Express's default HTML error page.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "That request is too large." });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong." });
});

export default app;
