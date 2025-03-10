
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskCard } from '@/components/TaskCard';
import { cn } from '@/lib/utils';

export const TaskList: React.FC = () => {
  const { filteredAndSortedTasks, viewMode } = useTaskContext();

  if (filteredAndSortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-2xl font-patrick mb-2">No tasks found</h3>
        <p className="text-muted-foreground">
          Try adding a new task or adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredAndSortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
