import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

type SubscriptionStatus = 'active' | 'inactive';

export interface SubscriptionData {
  status: SubscriptionStatus;
  plan?: string;
  is_paid_user?: boolean;
}

export interface SubscriptionResponse {
  data: SubscriptionData | null;
  error: Error | null;
}

export interface AuthUser extends User {
  subscription_status?: SubscriptionStatus;
  is_paid_user?: boolean;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jkpvmoceqxskibbrzbac.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcHZtb2NlcXhza2liYnJ6YmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDA5MTIsImV4cCI6MjA1NzAxNjkxMn0.p_xdjzVfs-8TloFwlEur0t_qpNn6AASO4zcpBvHdUdg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const getSubscriptionStatus = async (): Promise<SubscriptionResponse> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: { status: 'inactive' }, error: null };
  
  try {
    // First check if the user exists in the users table and if they are a paid user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_paid_user, stripe_customer_id, stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user payment status:', userError);
      return { 
        data: { status: 'inactive' }, 
        error: new Error(userError.message) 
      };
    }
    
    // If the user has a Stripe subscription ID, check the status from Stripe
    if (userData && userData.stripe_subscription_id) {
      try {
        // Call Supabase Edge Function to check subscription status
        const { data: stripeData, error: stripeError } = await supabase.functions.invoke('get-subscription-details', {
          body: { customerId: userData.stripe_customer_id }
        });
        
        if (!stripeError && stripeData && stripeData.status === 'active') {
          return { 
            data: { 
              status: 'active',
              plan: stripeData.plan || 'premium',
              is_paid_user: true
            }, 
            error: null 
          };
        }
      } catch (stripeErr) {
        console.error('Error checking Stripe subscription:', stripeErr);
        // Continue with database checks if Stripe check fails
      }
    }
    
    // If the user is marked as a paid user in the database, set status to active
    if (userData && userData.is_paid_user) {
      return { 
        data: { 
          status: 'active',
          plan: 'premium',
          is_paid_user: true
        }, 
        error: null 
      };
    }
    
    // Fallback to checking user_profiles for backward compatibility
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_status, plan')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { 
        data: { 
          status: 'inactive',
          is_paid_user: false 
        }, 
        error: new Error(profileError.message) 
      };
    }
    
    return { 
      data: { 
        status: profileData.subscription_status || 'inactive',
        plan: profileData.plan || 'free',
        is_paid_user: userData?.is_paid_user || false
      }, 
      error: null 
    };
  } catch (err) {
    return { 
      data: { 
        status: 'inactive',
        is_paid_user: false 
      }, 
      error: err instanceof Error ? err : new Error('Unknown error') 
    };
  }
};

export const authStateChanged = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as AuthUser ?? null);
  });
};