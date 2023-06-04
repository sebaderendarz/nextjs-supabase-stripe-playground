import initStripe, { Stripe } from "stripe";

const stripe: Stripe = initStripe(process.env.STRIPE_SECRET_KEY || "");

export default stripe;
