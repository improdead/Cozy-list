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
    // Get request body
    const { priceId, customerId, successUrl, cancelUrl } = await req.json();

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
      .select('stripe_customer_id')
      .eq('user_id', customerId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = userData?.stripe_customer_id;

    if (!stripeCustomerId) {
      // Get user email from auth.users
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(customerId);

      if (authError || !authUser.user) {
        throw new Error(`Error fetching auth user: ${authError?.message}`);
      }

      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: authUser.user.email,
        metadata: {
          supabaseUserId: customerId,
        },
      });

      stripeCustomerId = customer.id;

      // Store the Stripe customer ID in the database
      const { error: insertError } = await supabaseAdmin.from('users').upsert({
        user_id: customerId,
        stripe_customer_id: stripeCustomerId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        throw new Error(`Error inserting user: ${insertError.message}`);
      }
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        supabaseUserId: customerId,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});