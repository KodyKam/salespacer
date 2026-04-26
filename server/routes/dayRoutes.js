// server/routes/dayRoutes.js
import express from "express"
import { endDay } from "../controllers/entryController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/end", protect, endDay)

export default router