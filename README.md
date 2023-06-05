# NextJS, Supabase and Stripe playgroud

Repo for gaining experience in building products with NextJS.

## Features

- User authentication and management with Supabase
- Data access and management control with Postgres Row Level Policies (RLS)
- Integration with Stripe Checkout and Stripe Customer Portal
- Automatic creation of customers in Stripe with Supabase Webhooks
- Automatic syncing of state between Stripe, Supabase and the App with Stripe Webhooks

## How to run locally

### Populate .env.local file based on the example

- Keep `localhost:3000` as a base URL
- Generate a random string for API_ROUTE_SECRET
- Let other env vars be gibberish for a sec

### Handle webhook requests being send to the app running locally

- Install engrok `npm i -g engrok`
- Run engrok in the command line `engrok http 3000`
- Use temporary URL provided by engrok instead of `localhost:3000` when configuring Stripe and Supabase Webhooks
- NOTE: Ngrok URL is valid for 2 hours. Rerun Ngrok to get a brand new URL

### Create project in Supabase

- Populate Supabase related env vars in .env.local with values from Project Settings -> API
- Add db schema with data as specified in lib/supabase/schema.sql
- Disable all Auth Providers in Authentication -> Providers
- Configure and enable Github Auth Provider
- Enable RLS with current policies on public shema tables in Authentication -> Policies

### Add get_stripe_customer Supabase Webhook

- Go to Database -> Webhooks
- POST HTTP request on INSERT event on public.profile table
- URL `https://url-taken-from-engrok/api/create-stripe-customer`
- Content-type application-json
- HTTP Parameters API_ROUTE_SECRET taken from .env.local
- NOTE: Webhook may already exist when you populated the db public schema programmatically based on schema.sql

### Create Test Mode project in Stripe

- Populate Stripe Public and Secret API keys env vars in .env.local with values from Developers (top right corner) -> API Keys.

### Create Stripe Webhook

- Go to Developers -> Webhooks
- URL `https://url-taken-from-engrok/api/stripe-hooks`
- Events to send `customer.subscription.created`, `customer.subscription.deleted`, `customer.subscription.updated`
- Populate Stripe Hooks Signing Secret env var in .env.local with a value from Developers -> Webhooks -> Created Webhook -> Signing Secret

### Create Products in Stripe

- Product 1: Basic
  - Price 1: 20 USD per month
- Product 2: Pro
  - Price 1: 200 USD per year

### Rerun the NextJS app `npm run dev`

## Additional notes

- NextJS app is created with both old [Pages Router](https://nextjs.org/docs/pages/building-your-application) and a new, recommended [App Router](https://nextjs.org/docs/app). Ultimately, the entire app should be rafactored to use the App Router.
- When having a basic understanding of NextJS, Supabase and Stripe concepts, start building production ready products blazingly fast with [this awesome repo](https://github.com/vercel/nextjs-subscription-payments).
