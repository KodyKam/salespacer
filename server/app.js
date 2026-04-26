// server/app.js
import express from "express"
import cors from "cors"

import billingRoutes from "./routes/billingRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import seasonRoutes from "./routes/seasonRoutes.js"
import entryRoutes from "./routes/entryRoutes.js"
import dayRoutes from "./routes/dayRoutes.js"

const app = express()

// --------------------
// CORS (must be FIRST)
// --------------------
app.use(cors({
  origin: [
    "https://salespacer.vercel.app",
    "https://salespacerapp.vercel.app"
  ],
  credentials: true
}))

// --------------------
// Stripe webhook MUST be BEFORE express.json()
// --------------------
app.use("/api/billing/webhook", express.raw({ type: "application/json" }))

// --------------------
// JSON middleware
// --------------------
app.use(express.json())

// --------------------
// Routes
// --------------------
app.use("/api/billing", billingRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/season", seasonRoutes)
app.use("/api/entry", entryRoutes)
app.use("/api/day", dayRoutes)

// --------------------
// Health check
// --------------------
app.get("/", (req, res) => {
  res.send("API is running")
})

export default app