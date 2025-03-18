import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, AlertCircle, CreditCard, Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSubscriptionStatus } from '@/lib/supabase';
import { createCheckoutSession, getStripe } from '@/lib/stripe';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get plan type from URL parameters
  const params = new URLSearchParams(location.search);
  const planType = params.get('plan') as 'monthly' | 'yearly' || 'monthly';
  
  // Check for subscription status on URL params
  useEffect(() => {
    const subscriptionParam = params.get('subscription');
    
    if (subscriptionParam === 'success') {
      setSuccess('Your subscription was successfully activated!');
      toast({
        title: 'Subscription Activated',
        description: 'Your premium subscription is now active',
      });
      // Redirect to dashboard after successful subscription
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } else if (subscriptionParam === 'cancelled') {
      setError('Your subscription process was cancelled.');
    }
  }, [location.search, navigate, toast]);
  
  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the appropriate price ID based on the plan type
      const priceId = planType === 'monthly' 
        ? import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID 
        : import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID;
      
      // Create a checkout session and get the Stripe instance from our utility function
      const { sessionId } = await createCheckoutSession(
        priceId,
        window.location.origin + '/payment?subscription=success',
        window.location.origin + '/payment?subscription=cancelled'
      );
      
      // Get the Stripe instance from our utility function
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
  
  const getPlanDetails = () => {
    if (planType === 'monthly') {
      return {
        name: 'Monthly Premium',
        price: '$4.99',
        period: 'month',
        features: [
          'AI-Powered Task Suggestions',
          'Automatic Task Breakdown',
          'Habit-Based Insights',
          'Cloud Sync Across Devices'
        ]
      };
    } else {
      return {
        name: 'Yearly Premium',
        price: '$49.99',
        period: 'year',
        features: [
          'AI-Powered Task Suggestions',
          'Automatic Task Breakdown',
          'Habit-Based Insights',
          'Cloud Sync Across Devices',
          'Priority Support',
          '17% Discount'
        ]
      };
    }
  };
  
  const planDetails = getPlanDetails();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e6e9f0] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/settings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        
        <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  {planDetails.name}
                </CardTitle>
                <CardDescription>Complete your subscription</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
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
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  {planDetails.name}
                </h3>
                <div className="text-xl font-bold">
                  {planDetails.price}<span className="text-sm font-normal text-muted-foreground">/{planDetails.period}</span>
                </div>
              </div>
              
              <ul className="space-y-2 mb-4">
                {planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={handleSubscribe}
                disabled={loading || !!success}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Processing...' : success ? 'Subscribed!' : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Payment
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center text-sm text-muted-foreground gap-2">
                <Shield className="h-4 w-4" />
                Secure payment processing by Stripe
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;