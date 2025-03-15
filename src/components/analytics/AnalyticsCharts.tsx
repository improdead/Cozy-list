
import React, { useMemo } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { startOfWeek, addDays, format, subMonths, startOfMonth, endOfMonth, isSameMonth, isWithinInterval } from 'date-fns';

export const AnalyticsCharts: React.FC = () => {
  const { tasks } = useTaskContext();
  
  // Generate monthly completion trend data based on real task data
  const trendData = useMemo(() => {
    const today = new Date();
    const monthsToShow = 6;
    
    return Array.from({ length: monthsToShow }).map((_, index) => {
      const monthDate = subMonths(today, monthsToShow - 1 - index);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const monthName = format(monthDate, 'MMM');
      
      const completedInMonth = tasks.filter(task => 
        task.status === 'completed' && 
        task.updatedAt && 
        isWithinInterval(task.updatedAt, { start: monthStart, end: monthEnd })
      ).length;
      
      const createdInMonth = tasks.filter(task => 
        task.createdAt && 
        isWithinInterval(task.createdAt, { start: monthStart, end: monthEnd })
      ).length;
      
      return {
        name: monthName,
        completed: completedInMonth,
        created: createdInMonth
      };
    });
  }, [tasks]);
  
  // Generate weekly data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const startDay = startOfWeek(today);
    
    return Array.from({ length: 7 }).map((_, index) => {
      const day = addDays(startDay, index);
      const dayName = format(day, 'EEE');
      
      const completedToday = tasks.filter(task => 
        task.status === 'completed' && 
        task.updatedAt && 
        task.updatedAt.getDate() === day.getDate() && 
        task.updatedAt.getMonth() === day.getMonth() && 
        task.updatedAt.getFullYear() === day.getFullYear()
      ).length;
      
      const createdToday = tasks.filter(task => 
        task.createdAt && 
        task.createdAt.getDate() === day.getDate() && 
        task.createdAt.getMonth() === day.getMonth() && 
        task.createdAt.getFullYear() === day.getFullYear()
      ).length;
      
      return {
        name: dayName,
        completed: completedToday,
        created: createdToday
      };
    });
  }, [tasks]);
  
  return (
    <>
      <div className="bg-white p-6 rounded-lg border shadow-sm col-span-2">
        <h3 className="text-lg font-medium mb-4">Task Completion Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6E59A5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6E59A5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stroke="#6E59A5" 
              fillOpacity={1} 
              fill="url(#colorCompleted)" 
              name="Completed"
            />
            <Area 
              type="monotone" 
              dataKey="created" 
              stroke="#F97316" 
              fillOpacity={1} 
              fill="url(#colorCreated)" 
              name="Created"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-lg border shadow-sm col-span-2">
        <h3 className="text-lg font-medium mb-4">Weekly Task Activity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={weeklyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="created" fill="#F97316" name="Created" />
            <Bar dataKey="completed" fill="#6E59A5" name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
