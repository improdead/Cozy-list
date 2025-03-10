
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Tag } from 'lucide-react';

export const TagDistribution: React.FC = () => {
  const { tasks, availableTags } = useTaskContext();
  
  // Get tag counts
  const getTagCounts = () => {
    const tagCounts: { [key: string]: number } = {};
    
    availableTags.forEach(tag => {
      tagCounts[tag] = tasks.filter(task => task.tags.includes(tag)).length;
    });
    
    return tagCounts;
  };
  
  const tagCounts = getTagCounts();
  
  // Generate a color based on the tag name
  const getTagColor = (tag: string) => {
    const colors = {
      work: '#F97316',
      personal: '#6E59A5',
      urgent: '#EF4444',
      health: '#10B981',
      finance: '#3B82F6',
      study: '#F59E0B'
    };
    
    return (colors as any)[tag] || '#9B87F5';
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-medium">Task Categories</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(tagCounts).map(([tag, count]) => (
          <div key={tag} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getTagColor(tag) }}
              />
              <span className="capitalize">{tag}</span>
            </div>
            <span className="font-medium">{count}</span>
          </div>
        ))}
        
        {availableTags.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            No tags added to tasks yet. Add tags to your tasks to see analytics.
          </p>
        )}
      </div>
    </div>
  );
};
