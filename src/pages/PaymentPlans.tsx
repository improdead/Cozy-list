import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';

const PaymentPlans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: '$4.99',
      period: 'month',
      description: 'Billed monthly, cancel anytime.',
      features: [
        'AI-Powered Task Suggestions',
        'Automatic Task Breakdown',
        'Habit-Based Insights',
        'Cloud Sync Across Devices'
      ],
      highlight: false
    },
    {
      id: 'yearly',
      name: 'Yearly Premium',
      price: '$49.99',
      period: 'year',
      description: 'Billed annually, cancel anytime.',
      features: [
        'AI-Powered Task Suggestions',
        'Automatic Task Breakdown',
        'Habit-Based Insights',
        'Cloud Sync Across Devices',
        'Priority Support'
      ],
      highlight: true,
      savingsLabel: 'Save 17%'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    navigate(`/payment?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e6e9f0] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card className="bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-purple-500" />
              Choose Your Premium Plan
            </CardTitle>
            <CardDescription>Select the plan that works best for you</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden h-full flex flex-col ${plan.highlight ? 'border-purple-200' : ''}`}
                >
                  {plan.highlight && plan.savingsLabel && (
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-bl-md">
                      {plan.savingsLabel}
                    </div>
                  )}
                  
                  <h3 className="font-medium text-lg mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-2">
                    {plan.price}<span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full mt-auto ${plan.highlight ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  >
                    Select {plan.id === 'monthly' ? 'Monthly' : 'Yearly'} Plan
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center text-sm text-muted-foreground gap-2 mt-6">
              <Shield className="h-4 w-4" />
              Secure payment processing by Stripe
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPlans;