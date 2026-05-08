// server/controllers/authController.js
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { Resend } from "resend"

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

// 🟢 FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    // Always return success even if user not found (security)
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    user.resetToken = token
    user.resetTokenExpiry = expiry
    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Reset your SalesPacer password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>You requested a password reset for your SalesPacer account.</p>
          <p>Click the button below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="
            display: inline-block;
            margin-top: 16px;
            padding: 12px 24px;
            background: #1976d2;
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
          ">Reset Password</a>
          <p style="margin-top: 24px; opacity: 0.6; font-size: 13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `
    })

    res.json({ message: "If that email exists, a reset link has been sent." })

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err)
    res.status(500).json({ message: "Failed to send reset email" })
  }
}

// 🟢 RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword
    user.resetToken = null
    user.resetTokenExpiry = null
    await user.save()

    res.json({ message: "Password reset successfully" })

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err)
    res.status(500).json({ message: "Reset failed" })
  }
}