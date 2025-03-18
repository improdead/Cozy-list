
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Task } from '@/types/task';
import { Check, Calendar, Clock, Tag, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TaskForm } from '@/components/TaskForm';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useTaskContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteTask(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-slate-500';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'work':
        return 'bg-blue-50 text-blue-700';
      case 'personal':
        return 'bg-purple-50 text-purple-700';
      case 'finance':
        return 'bg-green-50 text-green-700';
      case 'study':
        return 'bg-amber-50 text-amber-700';
      case 'health':
        return 'bg-lime-50 text-lime-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="border rounded-lg bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center p-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 mr-3">
          <button
            className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center"
            onClick={handleToggleStatus}
            aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.status === 'completed' && (
              <Check className="h-3 w-3 text-green-600" />
            )}
          </button>
        </div>
        
        {/* Task Content */}
        <div className="flex-1 min-w-0 flex justify-between items-start">
          <div className="overflow-hidden">
            <h3 
              className={cn(
                'text-base font-medium',
                task.status === 'completed' ? 'line-through text-muted-foreground' : ''
              )}
            >
              {task.title}
            </h3>
            
            {task.description && (
              <p
                className={cn(
                  'text-sm text-muted-foreground mt-1 transition-all duration-200',
                  task.status === 'completed' ? 'line-through' : '',
                  !showFullDescription && task.description.length > 60 ? 'truncate' : '',
                  showFullDescription ? 'max-h-40' : 'max-h-6'
                )}
              >
                {task.description}
              </p>
            )}

            {/* Tags and other info */}
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Due Date */}
              {task.dueDate && (
                <div className={cn(
                  'inline-flex items-center text-xs gap-1 border rounded-md px-2 py-0.5',
                  isOverdue ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-700'
                )}>
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
              
              {/* Priority */}
              <div className="inline-flex items-center text-xs gap-1 border rounded-md px-2 py-0.5 border-slate-200 bg-slate-50">
                <Clock className={cn("h-3 w-3", getPriorityColor())} />
                <span>{task.priority}</span>
              </div>
              
              {/* Tags */}
              {task.tags.map((tag) => (
                <div 
                  key={tag} 
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs",
                    getTagColor(tag)
                  )}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex ml-4 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Edit className="h-4 w-4 text-slate-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <TaskForm task={task} mode="edit" />
              </DialogContent>
            </Dialog>
            
            <Button 
              variant={showDeleteConfirm ? "destructive" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {task.description && task.description.length > 60 && (
        <div className="px-4 pb-2 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={toggleDescription}
          >
            {showFullDescription ? (
              <>Show less <ChevronUp className="h-3 w-3 ml-1" /></>
            ) : (
              <>Show more <ChevronDown className="h-3 w-3 ml-1" /></>
            )}
          </Button>
        </div>
      )}
      
      {/* Optional progress bar (shown for tasks with progress) */}
      {false && (
        <div className="px-4 pb-3">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full rounded-full" 
              style={{ width: '33%' }}
            ></div>
          </div>
          <div className="text-xs text-right mt-1 text-muted-foreground">33%</div>
        </div>
      )}
    </div>
  );
};
