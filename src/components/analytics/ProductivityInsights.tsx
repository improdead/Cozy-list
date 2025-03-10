
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TrendingUp, Clock, Tag } from 'lucide-react';

export const ProductivityInsights: React.FC = () => {
  const { tasks, availableTags } = useTaskContext();
  
  // Mock improvement rate for demonstration
  const improvementRate = 15;
  
  // Find the most frequently used tag
  const findMostFrequentTag = () => {
    if (availableTags.length === 0) return null;
    
    const tagCounts: { [key: string]: number } = {};
    
    availableTags.forEach(tag => {
      tagCounts[tag] = tasks.filter(task => task.tags.includes(tag)).length;
    });
    
    const mostFrequentTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
    return mostFrequentTag ? mostFrequentTag[0] : null;
  };
  
  // Find the tag with the lowest completion rate
  const findLowestCompletionRateTag = () => {
    if (availableTags.length === 0) return null;
    
    const tagCompletionRates: { [key: string]: number } = {};
    
    availableTags.forEach(tag => {
      const tagTasks = tasks.filter(task => task.tags.includes(tag));
      const completedTagTasks = tagTasks.filter(task => task.status === 'completed');
      
      tagCompletionRates[tag] = tagTasks.length > 0 
        ? (completedTagTasks.length / tagTasks.length) * 100 
        : 0;
    });
    
    const lowestCompletionRateTag = Object.entries(tagCompletionRates)
      .filter(([_, rate]) => rate !== 0)
      .sort((a, b) => a[1] - b[1])[0];
      
    return lowestCompletionRateTag ? lowestCompletionRateTag[0] : null;
  };
  
  const mostFrequentTag = findMostFrequentTag();
  const lowestCompletionRateTag = findLowestCompletionRateTag();
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Productivity Insights</h3>
      
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <TrendingUp className="h-5 w-5" />
            <h4 className="font-medium">Completion Rate Improving</h4>
          </div>
          <p className="text-green-700">
            Your task completion rate has improved by {improvementRate}% compared to last month.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Clock className="h-5 w-5" />
            <h4 className="font-medium">Most Productive Time</h4>
          </div>
          <p className="text-blue-700">
            You complete most tasks between 9 AM and 11 AM. Consider scheduling important tasks during this time.
          </p>
        </div>
        
        {mostFrequentTag && lowestCompletionRateTag && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <Tag className="h-5 w-5" />
              <h4 className="font-medium">Category Focus</h4>
            </div>
            <p className="text-purple-700">
              You're most effective at completing <span className="font-medium">{mostFrequentTag}</span>-related tasks. 
              <span className="font-medium capitalize"> {lowestCompletionRateTag}</span> tasks have the lowest completion rate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
