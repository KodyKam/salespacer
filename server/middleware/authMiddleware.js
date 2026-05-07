// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey" // ✅ MUST MATCH authController

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, JWT_SECRET)

    req.user = {
      id: decoded.id
    }

    next()
  } catch (err) {
    console.error("JWT ERROR:", err.message)
    return res.status(401).json({ message: "Invalid token", error: err.message })
  }
}