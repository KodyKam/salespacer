// server/routes/seasonRoutes.js
import express from "express"
import {
  createSeason,
  getSeason,
  updateSeason,
  endSeason,
  getSeasonHistory,
  deleteSeason
} from "../controllers/seasonController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", protect, createSeason)
router.get("/", protect, getSeason)
router.put("/update", protect, updateSeason)
router.post("/end", protect, endSeason)
router.get("/history", protect, getSeasonHistory)
router.delete("/", protect, deleteSeason)

export default router