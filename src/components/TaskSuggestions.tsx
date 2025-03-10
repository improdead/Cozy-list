import React from 'react';
import { Sparkles } from 'lucide-react';
export const TaskSuggestions: React.FC = () => {
  // In a real app, these would come from an AI-based system
  const suggestions = [{
    id: 1,
    title: "Unlock Premium Features",
    description: "Upgrade to access AI-powered task suggestions, automatic task breakdown, insights, and more.",
    isPremium: true
  }];
  return <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <h2 className="text-lg font-patrick">AI Suggestions</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mb-3">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="font-medium mb-1">AI-Powered Task Suggestions</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get personalized task suggestions based on your habits and behavior patterns.
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