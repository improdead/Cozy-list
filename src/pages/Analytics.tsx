import React, { useState, useEffect } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Layout, LineChart, Calendar, Settings2, AlertCircle } from 'lucide-react';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { TagDistribution } from '@/components/analytics/TagDistribution';
import { PriorityDistribution } from '@/components/analytics/PriorityDistribution';
import { ProductivityInsights } from '@/components/analytics/ProductivityInsights';
import { TimeBasedAnalysis } from '@/components/analytics/TimeBasedAnalysis';
import { supabase, getSubscriptionStatus } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const Analytics = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setLoading(true);
        const { data: subscription } = await getSubscriptionStatus();
        setIsPremium(subscription?.status === 'active');
      } catch (err) {
        console.error('Error checking subscription:', err);
        setError('Failed to load subscription status');
      } finally {
        setLoading(false);
      }
    };
    
    checkSubscription();
  }, []);
  
  return (
    <TaskProvider>
      <main className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar with logo */}
          <div className="hidden md:flex w-64 flex-col bg-white/90 border-r border-border p-4 h-screen">
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="relative w-20 h-20">
                <img 
                  src="/lovable-uploads/d8bfce19-2f0d-46f6-9fbe-924f64b656e2.png" 
                  alt="Cozy Task Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-patrick text-primary">Cozy Task</span>
            </div>
            
            <nav className="space-y-2">
              <Link 
                to="/" 
                className={cn(
                  "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                  location.pathname === "/" ? "bg-secondary/50" : "text-muted-foreground"
                )}
              >
                <Layout className="w-5 h-5" />
                Dashboard
              </Link>
              <Link 
                to="/analytics" 
                className={cn(
                  "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                  location.pathname === "/analytics" ? "bg-secondary/50" : ""
                )}
              >
                <LineChart className="w-5 h-5" />
                Analytics
              </Link>
              <Link 
                to="/calendar" 
                className={cn(
                  "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                  location.pathname === "/calendar" ? "bg-secondary/50" : "text-muted-foreground"
                )}
              >
                <Calendar className="w-5 h-5" />
                Calendar
              </Link>
              <Link 
                to="/settings" 
                className={cn(
                  "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                  location.pathname === "/settings" ? "bg-secondary/50" : "text-muted-foreground"
                )}
              >
                <Settings2 className="w-5 h-5" />
                Settings
              </Link>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-patrick">Analytics</h1>
                <p className="text-muted-foreground text-sm">Track your productivity and task completion metrics</p>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {loading ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                  </div>
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <AnalyticsOverview />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnalyticsCharts />
                  </div>
                  <TimeBasedAnalysis />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TagDistribution />
                    <PriorityDistribution />
                  </div>
                  <ProductivityInsights />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </TaskProvider>
  );
};

export default Analytics;
