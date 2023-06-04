import axios from "axios";
import { UserContext, useUser } from "@/context/user";
import Link from "next/link";
import stripe from "../lib/stripe/server-client";
import createBrowserClient from "../lib/stripe/browser-client";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  currency: string;
}

interface PlanDetails {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: string;
  };
}

type PricingProps = {
  plans: Plan[];
};

const Pricing = ({ plans }: PricingProps) => {
  const { user, isLoading, login } = useUser() as UserContext;

  const processSubscription = (planId: string) => async () => {
    const response = await axios.get(`/api/subscription?planId=${planId}`);
    const sessionId = response.data.id;
    const stripe = await createBrowserClient();
    await stripe?.redirectToCheckout({ sessionId });
  };

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionButton = !!user && user.is_subscribed;

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-16">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            ${plan.price / 100} / {plan.interval}
          </p>
          {!isLoading && (
            <div>
              {showSubscribeButton && (
                <button onClick={processSubscription(plan.id)}>
                  Subscribe
                </button>
              )}
              {showCreateAccountButton && (
                <button onClick={login}>Create Account</button>
              )}
              {showManageSubscriptionButton && (
                <Link href="/dashboard">Manage Subscription</Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const { data: prices } = (await stripe.prices.list()) as {
    data: PlanDetails[];
  };

  let plans: Plan[] = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
      } as Plan;
    })
  );

  plans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans,
    },
  };
};

export default Pricing;
