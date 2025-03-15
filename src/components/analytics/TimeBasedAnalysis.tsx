import React, { useMemo } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Clock, Calendar } from 'lucide-react';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, subDays, differenceInDays } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const TimeBasedAnalysis: React.FC = () => {
  const { tasks } = useTaskContext();
  
  // Calculate average time to complete tasks
  const averageCompletionTime = useMemo(() => {
    const completedTasks = tasks.filter(task => 
      task.status === 'completed' && task.createdAt && task.updatedAt
    );
    
    if (completedTasks.length === 0) return null;
    
    const totalDays = completedTasks.reduce((sum, task) => {
      const creationDate = task.createdAt;
      const completionDate = task.updatedAt;
      const daysDifference = differenceInDays(completionDate, creationDate);
      return sum + daysDifference;
    }, 0);
    
    return Math.round(totalDays / completedTasks.length);
  }, [tasks]);
  
  // Calculate completion time by priority
  const completionTimeByPriority = useMemo(() => {
    const priorityGroups: Record<string, number[]> = {
      high: [],
      medium: [],
      low: []
    };
    
    tasks.forEach(task => {
      if (task.status === 'completed' && task.createdAt && task.updatedAt) {
        const daysDifference = differenceInDays(task.updatedAt, task.createdAt);
        priorityGroups[task.priority].push(daysDifference);
      }
    });
    
    const result: Record<string, number> = {};
    
    Object.entries(priorityGroups).forEach(([priority, days]) => {
      if (days.length > 0) {
        const average = days.reduce((sum, day) => sum + day, 0) / days.length;
        result[priority] = Math.round(average);
      } else {
        result[priority] = 0;
      }
    });
    
    return result;
  }, [tasks]);
  
  // Generate data for completion time trend
  const completionTimeTrend = useMemo(() => {
    const today = new Date();
    const daysToShow = 14;
    const data = [];
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const tasksCompletedOnDay = tasks.filter(task => 
        task.status === 'completed' && 
        task.updatedAt && 
        isWithinInterval(task.updatedAt, { start: dayStart, end: dayEnd })
      );
      
      const averageTimeForDay = tasksCompletedOnDay.length > 0 
        ? tasksCompletedOnDay.reduce((sum, task) => {
            const creationDate = task.createdAt;
            const completionDate = task.updatedAt;
            const daysDifference = differenceInDays(completionDate, creationDate);
            return sum + daysDifference;
          }, 0) / tasksCompletedOnDay.length
        : 0;
      
      data.push({
        date: format(date, 'MMM dd'),
        value: Math.round(averageTimeForDay * 10) / 10 // Round to 1 decimal place
      });
    }
    
    return data;
  }, [tasks]);
  
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-medium">Time-Based Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-purple-700 mb-1">Average Completion Time</h4>
          <p className="text-2xl font-bold text-purple-900">
            {averageCompletionTime !== null ? `${averageCompletionTime} days` : 'N/A'}
          </p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-amber-700 mb-1">High Priority Tasks</h4>
          <p className="text-2xl font-bold text-amber-900">
            {completionTimeByPriority.high > 0 ? `${completionTimeByPriority.high} days` : 'N/A'}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-700 mb-1">Low Priority Tasks</h4>
          <p className="text-2xl font-bold text-green-900">
            {completionTimeByPriority.low > 0 ? `${completionTimeByPriority.low} days` : 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-4">Completion Time Trend (Last 14 Days)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={completionTimeTrend}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#6E59A5" 
              name="Avg. Days to Complete"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};