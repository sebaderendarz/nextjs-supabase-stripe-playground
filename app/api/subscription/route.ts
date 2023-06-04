import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import createServerSupabase from "../../../lib/supabase/cookies/server-client";
import stripe from "../../../lib/stripe/server-client";

export async function GET(req: NextApiRequest) {
  const { searchParams } = new URL(req.url || "");
  const planId: string | null = searchParams.get("planId");
  if (!planId) {
    return NextResponse.json(
      { message: "planId search param is required" },
      { status: 400 }
    );
  }

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

  const lineItems = [
    {
      price: planId,
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    customer: stripe_customer,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancelled`,
  });

  return NextResponse.json({ id: session.id });
}
