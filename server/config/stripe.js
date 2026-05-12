// server/config/stripe.js
import Stripe from "stripe"

let _stripe = null

export const getStripe = () => {
    if (!_stripe) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    }
    return _stripe
}