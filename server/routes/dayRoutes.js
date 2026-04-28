// server/routes/dayRoutes.js
import express from "express"
import { endDay } from "../controllers/dayController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/end", endDay)

export default router