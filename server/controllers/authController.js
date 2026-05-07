// server/controllers/authController.js
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// 🔐 helper
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d"
  })
}

// 🟢 REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      password: hashedPassword
    })

    res.status(201).json({
      token: generateToken(user._id)
    })

  } catch (err) {
    console.error("REGISTER ERROR:", err)
    res.status(500).json({ message: "Register failed" })
  }
}

// 🟢 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    res.json({
      token: generateToken(user._id)
    })

  } catch (err) {
    console.error("LOGIN ERROR:", err)
    res.status(500).json({ message: "Login failed" })
  }
}