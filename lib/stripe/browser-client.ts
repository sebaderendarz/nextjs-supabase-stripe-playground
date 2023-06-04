import { loadStripe, Stripe } from "@stripe/stripe-js";

const createBrowserClient = async (): Promise<Stripe | null> => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");
};

export default createBrowserClient;
