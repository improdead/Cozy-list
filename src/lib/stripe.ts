import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe with your publishable key
// In production, this should be stored in an environment variable
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51OxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// Load the Stripe instance once
let stripePromise: Promise<any> | null = null;

/**
 * Get the Stripe instance
 */
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Create a checkout session for subscription
 * @param priceId The Stripe price ID for the subscription plan
 * @param successUrl URL to redirect after successful payment
 * @param cancelUrl URL to redirect if payment is cancelled
 */
export const createCheckoutSession = async (
  priceId: string,
  successUrl: string = window.location.origin + '/settings?subscription=success',
  cancelUrl: string = window.location.origin + '/settings?subscription=cancelled'
) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Call your backend function that creates a Stripe checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        customerId: user.id,
        successUrl,
        cancelUrl,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Create a customer portal session for managing subscription
 * @param returnUrl URL to redirect after the customer portal session
 */
export const createCustomerPortalSession = async (
  returnUrl: string = window.location.origin + '/settings'
) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Call your backend function that creates a Stripe customer portal session
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {
        customerId: user.id,
        returnUrl,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

/**
 * Get the current subscription status
 */
export const getSubscriptionDetails = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Call your backend function that gets the subscription details
    const { data, error } = await supabase.functions.invoke('get-subscription-details', {
      body: {
        customerId: user.id,
      },
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error getting subscription details:', error);
    return { data: null, error };
  }
};