// server/routes/entryRoutes.js
import express from "express"
import { addEntry } from "../controllers/entryController.js"
import { protect } from "../middleware/authMiddleware.js"


const router = express.Router()

router.post("/", protect, addEntry)

export default router