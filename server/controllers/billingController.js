// server/controllers/billingController.js
import { getStripe } from "../config/stripe.js"
import User from "../models/User.js"

export const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe()
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { plan } = req.body // "monthly" or "yearly"

    console.log("Plan:", plan)
    console.log("Monthly:", process.env.STRIPE_PRICE_MONTHLY)
    console.log("Yearly:", process.env.STRIPE_PRICE_YEARLY)

    const priceId = plan === "yearly"
      ? process.env.STRIPE_PRICE_YEARLY
      : process.env.STRIPE_PRICE_MONTHLY

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId },
      subscription_data: {
        trial_period_days: 7
      },
      success_url: `${process.env.CLIENT_URL}/pro-success`,
      cancel_url: `${process.env.CLIENT_URL}/settings`
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error("CHECKOUT ERROR:", err)
    res.status(500).json({ message: "Failed to create checkout session" })
  }
}

export const handleWebhook = async (req, res) => {
  const stripe = getStripe()
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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const userId = session.metadata.userId
      await User.findByIdAndUpdate(userId, {
        isPro: true,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription
      })
      console.log("PRO ACTIVATED for user:", userId)
      break
    }

    case "customer.subscription.deleted": {
      // Subscription cancelled or payment failed
      const subscription = event.data.object
      await User.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { isPro: false }
      )
      console.log("PRO DEACTIVATED for subscription:", subscription.id)
      break
    }

    default:
      console.log("Unhandled webhook event:", event.type)
  }

  res.json({ received: true })
}

export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const user = await User.findById(userId).select("isPro stripeCustomerId")
    res.json({ isPro: user?.isPro || false })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}