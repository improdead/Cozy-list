import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, Calendar, RefreshCw } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { generateTaskSuggestions, TaskSuggestion } from '@/lib/gemini';
import { getSubscriptionStatus, supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const TaskSuggestions: React.FC = () => {
  const { tasks, addTask } = useTaskContext();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [routineData, setRoutineData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch suggestions and routines
  const fetchSuggestionsAndRoutines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user has premium subscription
      const { data: subscription } = await getSubscriptionStatus();
      const hasPremium = subscription?.is_paid_user === true || subscription?.status === 'active';
      setIsPremium(hasPremium);
      
      // Only fetch AI suggestions if user has premium
      if (hasPremium) {
        // Get user ID for fetching routines
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch user's routines from Supabase
          const { data: routines, error } = await supabase
            .from('routines')
            .select('*')
            .eq('user_id', user.id);
          
          if (!error && routines) {
            setRoutineData(routines);
            
            // Generate AI suggestions based on tasks and routines
            const aiSuggestions = await generateTaskSuggestions(tasks, routines);
            setSuggestions(aiSuggestions);
          } else if (error) {
            console.error('Error fetching routines:', error);
            // Still try to generate suggestions without routines
            const aiSuggestions = await generateTaskSuggestions(tasks, []);
            setSuggestions(aiSuggestions);
          }
        } else {
          // Generate AI suggestions with just tasks if no user is found
          const aiSuggestions = await generateTaskSuggestions(tasks, []);
          setSuggestions(aiSuggestions);
        }
      } else {
        // Clear suggestions for non-premium users
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Failed to generate suggestions. Please try again.');
      // Don't clear existing suggestions on error
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch suggestions when tasks change
  useEffect(() => {
    fetchSuggestionsAndRoutines();
  }, [tasks]); // Remove routineData from dependencies to prevent infinite loop
  
  // Handle accepting a suggestion
  const handleAccept = (suggestion: TaskSuggestion) => {
    addTask({
      title: suggestion.title,
      description: suggestion.description,
      status: 'pending',
      dueDate: suggestion.dueDate,
      priority: suggestion.priority,
      tags: suggestion.tags
    });
    
    // Remove the suggestion after accepting
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    toast({
      title: "Task Added",
      description: "AI suggestion added to your tasks"
    });
  };
  
  // Handle dismissing a suggestion
  const handleDismiss = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };
  
  // Handle refreshing suggestions
  const handleRefresh = () => {
    fetchSuggestionsAndRoutines();
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };
  
  // If loading, show a loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-patrick">AI Suggestions</h2>
          </div>
        </div>
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  // If we have suggestions, show them
  if (suggestions.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-patrick">AI Suggestions</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-purple-100 p-1 rounded-full">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-medium">{suggestion.title}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatDate(suggestion.dueDate)}</span>
                
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${suggestion.priority === 'high' ? 'bg-red-100 text-red-700' : suggestion.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestion.tags.map((tag, index) => {
                  const tagColor = tag.toLowerCase() === 'work' ? 'bg-blue-50 text-blue-700' : 
                                  tag.toLowerCase() === 'health' ? 'bg-lime-50 text-lime-700' : 
                                  'bg-secondary text-secondary-foreground';
                  return (
                    <span key={index} className={`text-xs px-2 py-1 rounded-full ${tagColor}`}>{tag}</span>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <button 
                  onClick={() => handleDismiss(suggestion.id)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                  aria-label="Dismiss"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => handleAccept(suggestion)}
                  className="text-xs bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700"
                  aria-label="Accept"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => setSuggestions([])} 
            className="text-sm text-purple-600 hover:text-purple-800 underline"
          >
            Show premium features
          </button>
        </div>
      </div>
    );
  }

  // If no suggestions or not premium, show premium features
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-patrick">AI Suggestions</h2>
        </div>
        {isPremium && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Generate Suggestions
          </Button>
        )}
      </div>
      
      {error && isPremium && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mb-3">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-medium mb-1">AI-Powered Task Suggestions</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get personalized task suggestions based on your habits and daily routines.
          </p>
          <span className="inline-block text-xs text-purple-600 font-medium">Premium Feature</span>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-600">
              <path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3Z" />
            </svg>
          </div>
          <h3 className="font-medium mb-1">Automatic Task Breakdown</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Complex tasks are automatically divided into smaller, manageable steps.
          </p>
          <span className="inline-block text-xs text-purple-600 font-medium">Premium Feature</span>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-purple-600">
              <path d="M21 15V6"></path>
              <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
              <path d="M12 12H3"></path>
              <path d="M16 6H3"></path>
              <path d="M12 18H3"></path>
            </svg>
          </div>
          <h3 className="font-medium mb-1">Habit-Based Insights</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Receive insights about your productivity patterns and optimal work times.
          </p>
          <span className="inline-block text-xs text-purple-600 font-medium">Premium Feature</span>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-purple-600 text-white rounded-lg flex flex-col md:flex-row justify-between items-center">
        <div>
          <h3 className="font-patrick text-xl mb-1">Upgrade to TaskFlow AI Premium</h3>
          <p className="text-purple-100 text-sm">
            Unlock all premium features for just $4.99/month or $49.99/year and supercharge your productivity with AI.
          </p>
        </div>
        <button className="mt-4 md:mt-0 py-2 bg-white text-purple-600 rounded-md font-medium hover:bg-purple-50 transition-colors px-[9px]">
          Upgrade Now
        </button>
      </div>
    </div>;
};