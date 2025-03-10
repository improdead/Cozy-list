
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { CircleAlert } from 'lucide-react';

export const PriorityDistribution: React.FC = () => {
  const { tasks } = useTaskContext();
  
  const highPriorityCount = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityCount = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityCount = tasks.filter(task => task.priority === 'low').length;
  
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CircleAlert className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-medium">Task Priorities</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>High</span>
          </div>
          <span className="font-medium">{highPriorityCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Medium</span>
          </div>
          <span className="font-medium">{mediumPriorityCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Low</span>
          </div>
          <span className="font-medium">{lowPriorityCount}</span>
        </div>
      </div>
    </div>
  );
};
