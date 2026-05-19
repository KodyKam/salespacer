// server/app.js
import express from "express"
import cors from "cors"
import billingRoutes from "./routes/billingRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import seasonRoutes from "./routes/seasonRoutes.js"
import entryRoutes from "./routes/entryRoutes.js"
import dayRoutes from "./routes/dayRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { handleWebhook } from "./controllers/billingController.js"

const app = express()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://salespacer.vercel.app",
    "https://salespacer.ca",
    "https://www.salespacer.ca"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

// ⚠️ Webhook must come BEFORE express.json()
app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
)

// All other routes parse JSON normally
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/billing", billingRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/season", seasonRoutes)
app.use("/api/entry", entryRoutes)
app.use("/api/day", dayRoutes)

app.get("/", (req, res) => res.send("API is running"))

export default app