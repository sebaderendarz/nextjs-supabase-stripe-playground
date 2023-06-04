import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import supabaseAdmin from "@/lib/supabase/admin-client";
import stripe from "../../lib/stripe/server-client";
import { Stripe } from "stripe";

export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = req.headers["stripe-signature"];
  const reqBuffer = await buffer(req);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature as string,
      process.env.STRIPE_HOOKS_SIGNING_SECRET || ""
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  switch (event.type) {
    case "customer.subscription.updated":
      await supabaseAdmin
        .from("profile")
        .update({
          is_subscribed: true,
          interval: event.data.object.items.data[0].plan.interval,
        })
        .eq("stripe_customer", event.data.object.customer);
      break;
    case "customer.subscription.deleted":
      await supabaseAdmin
        .from("profile")
        .update({
          is_subscribed: false,
          interval: null,
        })
        .eq("stripe_customer", event.data.object.customer);
      break;
  }

  res.send({ received: true });
};

export default handler;
