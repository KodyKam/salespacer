// server/routes/seasonRoutes.js
import express from "express"
import { createSeason } from "../controllers/seasonController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", createSeason) //protect temporarily removed for testing

export default router