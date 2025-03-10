import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

type SubscriptionStatus = 'active' | 'inactive';

export interface SubscriptionData {
  status: SubscriptionStatus;
  plan?: string;
}

export interface SubscriptionResponse {
  data: SubscriptionData | null;
  error: Error | null;
}

export interface AuthUser extends User {
  subscription_status?: SubscriptionStatus;
}

const SUPABASE_URL = 'https://jkpvmoceqxskibbrzbac.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcHZtb2NlcXhza2liYnJ6YmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDA5MTIsImV4cCI6MjA1NzAxNjkxMn0.p_xdjzVfs-8TloFwlEur0t_qpNn6AASO4zcpBvHdUdg';

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
    const { data, error } = await supabase
      .from('user_profiles')
      .select('subscription_status, plan')
      .eq('id', user.id)
      .single();

    if (error) {
      return { 
        data: { status: 'inactive' }, 
        error: new Error(error.message) 
      };
    }
    
    return { 
      data: { 
        status: data.subscription_status || 'inactive',
        plan: data.plan || 'free'
      }, 
      error: null 
    };
  } catch (err) {
    return { 
      data: { status: 'inactive' }, 
      error: err instanceof Error ? err : new Error('Unknown error') 
    };
  }
};

export const authStateChanged = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as AuthUser ?? null);
  });
};