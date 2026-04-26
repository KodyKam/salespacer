// server/models/User.js
import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    subscriptionStatus: {
      type: String,
      default: "inactive"
    },

    stripeCustomerId: String
  },
  { timestamps: true }
)

export default mongoose.model("User", UserSchema)