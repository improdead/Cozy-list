
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { cn } from '@/lib/utils';

export const TaskFilters: React.FC = () => {
  const { filterOption, setFilterOption } = useTaskContext();
  
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'pending', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
  ];
  
  return (
    <div className="flex space-x-2 border-b pb-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md",
            filterOption === filter.id ? "text-primary font-medium" : "text-muted-foreground"
          )}
          onClick={() => setFilterOption(filter.id as any)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
