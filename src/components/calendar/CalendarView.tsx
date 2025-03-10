
import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  parseISO, 
  isWithinInterval,
  addDays,
  getDay
} from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Crown, Plus, ChevronDown, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TaskForm } from '@/components/TaskForm';

interface CalendarViewProps {
  onDateClick: (date: Date) => void;
  onTaskClick: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  onDateClick,
  onTaskClick
}) => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week'>('month');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { tasks, updateTask } = useTaskContext();
  
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Get days for month view
  const getCalendarDays = () => {
    // Get day of week of first day (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = startOfMonth(currentMonth);
    const dayOfWeek = getDay(firstDayOfMonth);
    
    // Get the start date (might be in the previous month)
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Get 42 days (6 weeks) starting from startDate
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const date = addDays(startDate, i);
      dates.push(date);
    }
    
    // Chunk the dates into weeks
    const weeks = [];
    for (let i = 0; i < 6; i++) {
      weeks.push(dates.slice(i * 7, (i + 1) * 7));
    }
    
    return weeks;
  };

  const calendarWeeks = getCalendarDays();

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const [taskId, dateString] = draggableId.split('|');
    const destinationDate = new Date(destination.droppableId);
    
    // Update task due date
    updateTask(taskId, { dueDate: destinationDate });
    
    toast({
      title: "Task rescheduled",
      description: `Task moved to ${format(destinationDate, 'EEEE, MMMM d')}`,
    });
  };

  // Get background color based on task tag
  const getTaskColor = (task: Task) => {
    if (task.tags.includes('urgent')) return "bg-red-100 text-red-800";
    if (task.tags.includes('work')) return "bg-blue-100 text-blue-800";
    if (task.tags.includes('personal')) return "bg-purple-100 text-purple-800";
    return "bg-green-100 text-green-800";
  };

  // Render a maximum of 3 tasks per day with a "+X more" for additional tasks
  const renderTasksForDate = (date: Date, tasksForDate: Task[]) => {
    if (tasksForDate.length === 0) return null;
    
    const visibleTasks = tasksForDate.slice(0, 3);
    const hiddenTasksCount = tasksForDate.length - 3;
    
    return (
      <>
        {visibleTasks.map((task) => (
          <Draggable 
            key={`${task.id}|${date.toISOString()}`} 
            draggableId={`${task.id}|${date.toISOString()}`} 
            index={tasksForDate.indexOf(task)}
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={cn(
                  "text-xs px-2 py-1 rounded-full truncate mb-1 cursor-pointer transition-all",
                  getTaskColor(task),
                  task.status === 'completed' && "opacity-50 line-through"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
              >
                {task.title}
              </div>
            )}
          </Draggable>
        ))}
        
        {hiddenTasksCount > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            +{hiddenTasksCount} more
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {}}
            className="rounded-md"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>New</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-md"
              >
                <span className="mr-1">Month</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setViewType('month')}>Month</DropdownMenuItem>
              <DropdownMenuItem>Week</DropdownMenuItem>
              <DropdownMenuItem>Day</DropdownMenuItem>
              <DropdownMenuItem>Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="rounded-md"
          >
            <span className="mr-1">Today</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {}}
            className="rounded-full"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevMonth}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextMonth}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <TaskForm 
              mode="create" 
              initialData={{ dueDate: new Date() }} 
              onSuccess={() => setIsTaskFormOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-7 border-b pb-2 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-sm text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarWeeks.flat().map((date) => {
            const tasksForDate = getTasksForDate(date);
            
            return (
              <Droppable 
                key={date.toISOString()} 
                droppableId={date.toISOString()}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "min-h-[80px] p-1 border border-gray-100 hover:bg-gray-50 transition-colors",
                      !isSameMonth(date, currentMonth) && "opacity-40 bg-gray-50",
                      isToday(date) && "ring-2 ring-primary/50",
                      tasksForDate.length > 0 && "bg-white"
                    )}
                    onClick={() => onDateClick(date)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                          isToday(date) && "bg-primary text-white"
                        )}
                      >
                        {format(date, 'd')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {renderTasksForDate(date, tasksForDate)}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
