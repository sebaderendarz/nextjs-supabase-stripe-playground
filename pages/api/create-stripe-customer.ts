import { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../../lib/supabase/admin-client";
import stripe from "../../lib/stripe/server-client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send("You are not authorized to call this API");
  }

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });

  await supabaseAdmin
    .from("profile")
    .update({ stripe_customer: customer.id })
    .eq("id", req.body.record.id);

  res.send({ message: `stripe customer created: ${customer.id}` });
};

export default handler;
