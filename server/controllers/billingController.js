// server/controllers/billingController.js
import { stripe } from "../config/stripe.js"
import User from "../models/User.js"

export const handleWebhook = async (req, res) => {

  const sig = req.headers["stripe-signature"]

  let event

  try {

    event = stripe.webhooks.constructEvent(

      req.body,

      sig,

      process.env.STRIPE_WEBHOOK_SECRET

    )

  } catch (err) {

    console.error("Webhook signature failed:", err.message)

    return res.status(400).send(`Webhook Error: ${err.message}`)

  }

  if (event.type === "checkout.session.completed") {

    const session = event.data.object

    const userId = session.metadata.userId

    await User.findByIdAndUpdate(userId, {

      subscriptionStatus: "active",

      stripeCustomerId: session.customer

    })

  }

  res.json({ received: true })

}

// Protected route because user ID needed for metadata and security
export const createCheckoutSession = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",

    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ],

    metadata: {
      userId: "dev-user-123"
    },

    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`
  })

  res.json({ url: session.url })
}