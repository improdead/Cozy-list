import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSubscriptionStatus } from '@/lib/supabase';
import { createCheckoutSession, createCustomerPortalSession, getStripe } from '@/lib/stripe';

interface SubscriptionManagerProps {
  onSubscriptionChange?: () => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onSubscriptionChange }) => {
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive'>('inactive');
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | undefined>('free');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for subscription status on component mount and URL params
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true);
        const { data } = await getSubscriptionStatus();
        
        if (data) {
          setSubscriptionStatus(data.status);
          setSubscriptionPlan(data.plan);
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
        setError('Failed to load subscription status');
      } finally {
        setLoading(false);
      }
    };
    
    checkSubscription();
    
    // Check URL parameters for subscription status
    const params = new URLSearchParams(location.search);
    const subscriptionParam = params.get('subscription');
    
    if (subscriptionParam === 'success') {
      setSuccess('Your subscription was successfully activated!');
      toast({
        title: 'Subscription Activated',
        description: 'Your premium subscription is now active',
      });
      // Remove the query parameter
      navigate('/settings', { replace: true });
      // Refresh subscription status
      checkSubscription();
      // Notify parent component if callback provided
      if (onSubscriptionChange) onSubscriptionChange();
    } else if (subscriptionParam === 'cancelled') {
      setError('Your subscription process was cancelled.');
      // Remove the query parameter
      navigate('/settings', { replace: true });
    }
  }, [location.search, navigate, toast, onSubscriptionChange]);
  
  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the appropriate price ID based on the plan type
      const priceId = planType === 'monthly' 
        ? import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID 
        : import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID;
      
      // Create a checkout session
      const { sessionId } = await createCheckoutSession(priceId);
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
      
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('Failed to start subscription process. Please try again.');
      toast({
        title: 'Subscription Error',
        description: 'There was a problem processing your subscription',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create a customer portal session
      const { url } = await createCustomerPortalSession();
      
      // Redirect to the customer portal
      window.location.href = url;
    } catch (err) {
      console.error('Error managing subscription:', err);
      setError('Failed to access subscription management. Please try again.');
      toast({
        title: 'Portal Access Error',
        description: 'There was a problem accessing your subscription portal',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="bg-white/70 backdrop-blur-sm border border-white/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </div>
          {subscriptionStatus === 'active' && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}
        
        {subscriptionStatus === 'active' ? (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-medium mb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Premium Plan
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                You currently have access to all premium features.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  AI-Powered Task Suggestions
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Automatic Task Breakdown
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Habit-Based Insights
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Cloud Sync Across Devices
                </li>
              </ul>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleManageSubscription}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Manage Subscription'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <h3 className="font-medium mb-1">Monthly Plan</h3>
                <div className="text-2xl font-bold mb-2">$4.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <p className="text-sm text-muted-foreground mb-3">
                  Billed monthly, cancel anytime.
                </p>
                <ul className="space-y-2 mb-4 flex-grow">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    AI-Powered Task Suggestions
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Automatic Task Breakdown
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Habit-Based Insights
                  </li>
                  <li className="flex items-center gap-2 text-sm opacity-50">
                    <CheckCircle2 className="h-4 w-4 text-gray-400" />
                    Priority Support
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/payment-plans')}
                  disabled={loading}
                  className="w-full mt-auto"
                >
                  {loading ? 'Processing...' : 'Choose Plan'}
                </Button>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-bl-md">
                  Save 17%
                </div>
                <h3 className="font-medium mb-1">Yearly Plan</h3>
                <div className="text-2xl font-bold mb-2">$49.99<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                <p className="text-sm text-muted-foreground mb-3">
                  Billed annually, cancel anytime.
                </p>
                <ul className="space-y-2 mb-4 flex-grow">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    AI-Powered Task Suggestions
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Automatic Task Breakdown
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Habit-Based Insights
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Priority Support
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/payment-plans')}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 mt-auto"
                >
                  {loading ? 'Processing...' : 'Choose Plan'}
                </Button>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Secure payment processing by Stripe. Your data is protected and never shared.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;