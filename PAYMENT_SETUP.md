# Payment Processing Setup Guide

## Issue: Failed to Start Subscription Process

You're seeing the error message "Failed to start subscription process. Please try again" because the Stripe API keys in your `.env` file are placeholder values, not real API keys.

## How to Fix

1. Sign up for a Stripe account at [stripe.com](https://stripe.com) if you haven't already
2. Get your API keys from the Stripe Dashboard:
   - Go to Developers > API keys in your Stripe Dashboard
   - Copy your Publishable key (starts with `pk_test_` for test mode or `pk_live_` for live mode)
   - Copy your Secret key (starts with `sk_test_` for test mode or `sk_live_` for live mode)

3. Create price products in your Stripe Dashboard:
   - Go to Products > Add Product
   - Create a monthly subscription product and note its Price ID (starts with `price_`)
   - Create a yearly subscription product and note its Price ID (starts with `price_`)

4. Update your `.env` file with the real values:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
   VITE_STRIPE_MONTHLY_PRICE_ID=price_your_actual_monthly_price_id
   VITE_STRIPE_YEARLY_PRICE_ID=price_your_actual_yearly_price_id
   ```

5. For the Supabase Edge Functions to work properly, you'll also need to set these environment variables in your Supabase project:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Add the following environment variables:
     - `STRIPE_SECRET_KEY`: Your Stripe secret key
     - `STRIPE_WEBHOOK_SECRET`: Create this in the Stripe Dashboard under Developers > Webhooks

## Testing the Integration

After setting up the real API keys:
1. Restart your development server
2. Try the subscription process again
3. For testing payments, use Stripe's test card numbers:
   - Card number: `4242 4242 4242 4242`
   - Expiration date: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

## Note

The payment processing will continue to fail until you replace the placeholder values with actual Stripe API keys. The current values in your `.env` file are:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51OxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_STRIPE_MONTHLY_PRICE_ID=price_1XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_STRIPE_YEARLY_PRICE_ID=price_1XXXXXXXXXXXXXXXXXXXXXXXXXX
```

These need to be replaced with your actual Stripe API keys and price IDs.