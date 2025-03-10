
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { BarChart3, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export const AnalyticsOverview: React.FC = () => {
  const { tasks } = useTaskContext();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
            <h3 className="text-3xl font-bold mt-1">{totalTasks}</h3>
          </div>
          <div className="bg-purple-100 p-2 rounded-full">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <h3 className="text-3xl font-bold mt-1">{completedTasks}</h3>
          </div>
          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <h3 className="text-3xl font-bold mt-1">{pendingTasks}</h3>
          </div>
          <div className="bg-yellow-100 p-2 rounded-full">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
            <h3 className="text-3xl font-bold mt-1">{completionRate}%</h3>
          </div>
          <div className="bg-blue-100 p-2 rounded-full">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
