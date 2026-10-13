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
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);

export default app;
