
import React, { useMemo } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TrendingUp, Clock, Tag } from 'lucide-react';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval, format, parse, isSameMonth } from 'date-fns';

export const ProductivityInsights: React.FC = () => {
  const { tasks, availableTags } = useTaskContext();
  
  // Calculate improvement rate based on task completion data
  const improvementRate = useMemo(() => {
    const today = new Date();
    const currentMonth = today;
    const previousMonth = subMonths(today, 1);
    
    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthEnd = endOfMonth(currentMonth);
    const previousMonthStart = startOfMonth(previousMonth);
    const previousMonthEnd = endOfMonth(previousMonth);
    
    const currentMonthCompletedTasks = tasks.filter(task => 
      task.status === 'completed' && 
      task.updatedAt && 
      isWithinInterval(task.updatedAt, { start: currentMonthStart, end: currentMonthEnd })
    ).length;
    
    const previousMonthCompletedTasks = tasks.filter(task => 
      task.status === 'completed' && 
      task.updatedAt && 
      isWithinInterval(task.updatedAt, { start: previousMonthStart, end: previousMonthEnd })
    ).length;
    
    // Calculate improvement rate
    if (previousMonthCompletedTasks === 0) {
      return currentMonthCompletedTasks > 0 ? 100 : 0;
    }
    
    const rate = ((currentMonthCompletedTasks - previousMonthCompletedTasks) / previousMonthCompletedTasks) * 100;
    return Math.round(rate);
  }, [tasks]);
  
  // Find the most productive time of day
  const mostProductiveTime = useMemo(() => {
    // Group completed tasks by hour of day
    const hourCounts: Record<number, number> = {};
    
    tasks.forEach(task => {
      if (task.status === 'completed' && task.updatedAt) {
        const hour = task.updatedAt.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    
    // Find the hour with the most completed tasks
    let maxHour = 0;
    let maxCount = 0;
    
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = parseInt(hour);
      }
    });
    
    // Format the time range
    const startHour = maxHour;
    const endHour = (maxHour + 2) % 24; // 2-hour window
    
    const formatHour = (hour: number) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour} ${period}`;
    };
    
    return {
      startTime: formatHour(startHour),
      endTime: formatHour(endHour),
      count: maxCount
    };
  }, [tasks]);
  
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
            <h4 className="font-medium">Completion Rate {improvementRate >= 0 ? 'Improving' : 'Declining'}</h4>
          </div>
          <p className="text-green-700">
            {improvementRate !== 0 ? (
              <>Your task completion rate has {improvementRate >= 0 ? 'improved' : 'decreased'} by {Math.abs(improvementRate)}% compared to last month.</>
            ) : (
              <>Your task completion rate is unchanged compared to last month.</>
            )}
          </p>
        </div>
        
        {mostProductiveTime.count > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Clock className="h-5 w-5" />
              <h4 className="font-medium">Most Productive Time</h4>
            </div>
            <p className="text-blue-700">
              You complete most tasks between {mostProductiveTime.startTime} and {mostProductiveTime.endTime}. 
              Consider scheduling important tasks during this time.
            </p>
          </div>
        )}
        
        {mostFrequentTag && lowestCompletionRateTag && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <Tag className="h-5 w-5" />
              <h4 className="font-medium">Category Focus</h4>
            </div>
            <p className="text-purple-700">
              You're most effective at completing <span className="font-medium capitalize">{mostFrequentTag}</span>-related tasks. 
              <span className="font-medium capitalize"> {lowestCompletionRateTag}</span> tasks have the lowest completion rate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
