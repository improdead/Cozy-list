
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/types/task';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { X, Check, Calendar as CalendarIcon, Plus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TaskForm } from '@/components/TaskForm';

interface CalendarSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedTask: Task | null;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTask
}) => {
  const { tasks, toggleTaskStatus, deleteTask } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  // Get tasks for selected date
  const tasksForDate = selectedDate
    ? tasks.filter(task => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate).toDateString() === selectedDate.toDateString();
      })
    : [];
  
  const handleToggleStatus = (taskId: string) => {
    toggleTaskStatus(taskId);
  };
  
  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };
  
  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-md bg-white/90 backdrop-blur-md border border-white/30">
          {selectedDate && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-patrick">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {tasksForDate.length} tasks scheduled
                  </p>
                </div>
                <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="futuristic-button">
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Add Task</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-md border border-white/30">
                    <TaskForm 
                      mode="create" 
                      initialData={{ dueDate: selectedDate }} 
                      onSuccess={() => setIsTaskFormOpen(false)} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-patrick text-lg">Tasks for Today</h3>
                  {tasksForDate.length > 5 && (
                    <div className="flex items-center text-sm text-primary">
                      <Crown className="h-4 w-4 mr-1" />
                      <span>Premium: Unlimited Tasks</span>
                    </div>
                  )}
                </div>
                
                {tasksForDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
                    <p>No tasks scheduled for this day</p>
                    <Button 
                      variant="link" 
                      onClick={() => setIsTaskFormOpen(true)}
                    >
                      Add your first task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasksForDate.map((task) => (
                      <div 
                        key={task.id}
                        className="futuristic-card p-4 relative"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <button
                              className="checkbox-container flex-shrink-0 mt-1"
                              onClick={() => handleToggleStatus(task.id)}
                            >
                              <div 
                                className={cn(
                                  "checkbox-custom",
                                  task.status === 'completed' && "checked"
                                )}
                              >
                                {task.status === 'completed' && (
                                  <Check className="h-3 w-3 checkmark checked text-white" />
                                )}
                              </div>
                            </button>
                            <div>
                              <h4 
                                className={cn(
                                  "text-base font-medium",
                                  task.status === 'completed' && "task-text-completed"
                                )}
                              >
                                {task.title}
                              </h4>
                              {task.description && (
                                <p 
                                  className={cn(
                                    "text-sm text-muted-foreground mt-1",
                                    task.status === 'completed' && "task-text-completed"
                                  )}
                                >
                                  {task.description}
                                </p>
                              )}
                              <div className="flex gap-2 mt-2">
                                {task.tags.map((tag) => (
                                  <span 
                                    key={tag} 
                                    className={cn(
                                      "tag",
                                      `tag-${tag}`
                                    )}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTask(task.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {selectedTask && !selectedDate && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-patrick">Task Details</h2>
              </div>
              
              <div className="futuristic-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <button
                      className="checkbox-container flex-shrink-0 mt-1"
                      onClick={() => handleToggleStatus(selectedTask.id)}
                    >
                      <div 
                        className={cn(
                          "checkbox-custom",
                          selectedTask.status === 'completed' && "checked"
                        )}
                      >
                        {selectedTask.status === 'completed' && (
                          <Check className="h-3 w-3 checkmark checked text-white" />
                        )}
                      </div>
                    </button>
                    <div>
                      <h4 
                        className={cn(
                          "text-base font-medium",
                          selectedTask.status === 'completed' && "task-text-completed"
                        )}
                      >
                        {selectedTask.title}
                      </h4>
                      {selectedTask.description && (
                        <p 
                          className={cn(
                            "text-sm text-muted-foreground mt-1",
                            selectedTask.status === 'completed' && "task-text-completed"
                          )}
                        >
                          {selectedTask.description}
                        </p>
                      )}
                      {selectedTask.dueDate && (
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {format(new Date(selectedTask.dueDate), 'PPP')}
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        {selectedTask.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className={cn(
                              "tag",
                              `tag-${tag}`
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
