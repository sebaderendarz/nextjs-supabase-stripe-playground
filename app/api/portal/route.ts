import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import createServerSupabase from "../../../lib/supabase/cookies/server-client";
import stripe from "../../../lib/stripe/server-client";

export async function GET(req: NextApiRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const {
    data: { stripe_customer },
  } = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", user.id)
    .single();

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
