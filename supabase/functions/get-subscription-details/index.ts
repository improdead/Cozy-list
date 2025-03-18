import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';
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
    // Get request body
    const { customerId } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Get user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_id', customerId)
      .single();

    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    if (!userData?.stripe_customer_id) {
      return new Response(JSON.stringify({ status: 'inactive' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: userData.stripe_customer_id,
      status: 'active',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      // Update user record to reflect inactive status
      await supabaseAdmin.from('users').update({
        is_paid_user: false,
        updated_at: new Date().toISOString(),
      }).eq('user_id', customerId);

      return new Response(JSON.stringify({ status: 'inactive' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Get the active subscription
    const subscription = subscriptions.data[0];
    
    // Get the product details
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);

    // Update user record with subscription details
    await supabaseAdmin.from('users').update({
      is_paid_user: true,
      stripe_subscription_id: subscription.id,
      subscription_status: 'active',
      plan: product.name.toLowerCase().includes('yearly') ? 'yearly' : 'monthly',
      updated_at: new Date().toISOString(),
    }).eq('user_id', customerId);

    return new Response(JSON.stringify({
      status: 'active',
      plan: product.name.toLowerCase().includes('yearly') ? 'yearly' : 'monthly',
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error getting subscription details:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});