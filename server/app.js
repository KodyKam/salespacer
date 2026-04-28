// server/app.js
import express from "express"
import cors from "cors"

import billingRoutes from "./routes/billingRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import seasonRoutes from "./routes/seasonRoutes.js"
import entryRoutes from "./routes/entryRoutes.js"
import dayRoutes from "./routes/dayRoutes.js"

const app = express()

// ✅ MUST BE FIRST (before routes)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://salespacer.vercel.app"
  ],
  credentials: true
}))

app.use(express.json())

// routes
app.use("/api/billing", billingRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/season", seasonRoutes)
app.use("/api/entry", entryRoutes)
app.use("/api/day", dayRoutes)

app.get("/", (req, res) => {
  res.send("API is running")
})

export default app