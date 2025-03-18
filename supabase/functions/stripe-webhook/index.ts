import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import Stripe from 'https://esm.sh/stripe@12.5.0?dts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSignature = req.headers.get('stripe-signature');
    if (!stripeSignature) {
      throw new Error('No Stripe signature found');
    }

    // Get the raw request body
    const body = await req.text();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    );

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.metadata?.supabaseUserId;

        if (customerId) {
          // Update user record to reflect paid status
          await supabaseAdmin.from('users').update({
            is_paid_user: true,
            updated_at: new Date().toISOString(),
          }).eq('user_id', customerId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const stripeCustomerId = subscription.customer;

        // Get the Supabase user ID from the Stripe customer ID
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .select('user_id')
          .eq('stripe_customer_id', stripeCustomerId)
          .single();

        if (userError || !userData) {
          console.error('Error finding user for subscription update:', userError);
          break;
        }

        // Get the product details
        const productId = subscription.items.data[0].price.product;
        const product = await stripe.products.retrieve(productId as string);

        // Update user record with subscription details
        await supabaseAdmin.from('users').update({
          is_paid_user: subscription.status === 'active',
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          plan: product.name.toLowerCase().includes('yearly') ? 'yearly' : 'monthly',
          updated_at: new Date().toISOString(),
        }).eq('user_id', userData.user_id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeCustomerId = subscription.customer;

        // Get the Supabase user ID from the Stripe customer ID
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .select('user_id')
          .eq('stripe_customer_id', stripeCustomerId)
          .single();

        if (userError || !userData) {
          console.error('Error finding user for subscription deletion:', userError);
          break;
        }

        // Update user record to reflect cancelled subscription
        await supabaseAdmin.from('users').update({
          is_paid_user: false,
          subscription_status: 'inactive',
          updated_at: new Date().toISOString(),
        }).eq('user_id', userData.user_id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});