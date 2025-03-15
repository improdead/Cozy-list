
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
  getDay,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  getHours,
  getMinutes,
  setHours,
  setMinutes
} from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Crown, Plus, ChevronDown, Calendar as CalendarIcon, MoreHorizontal, ChevronUp } from 'lucide-react';
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { tasks, updateTask } = useTaskContext();
  
  const nextPeriod = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      default:
        setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const prevPeriod = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
      default:
        setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  // Get days for month view
  const getCalendarDays = () => {
    // Get day of week of first day (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = startOfMonth(currentDate);
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

  // Get days for week view
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
    
    return eachDayOfInterval({ start, end });
  };

  const calendarWeeks = getCalendarDays();
  const weekDays = getWeekDays();

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

  // Render a maximum of 4 tasks per day with a "+X more" for additional tasks
  const renderTasksForDate = (date: Date, tasksForDate: Task[]) => {
    if (tasksForDate.length === 0) return null;
    
    const visibleTasks = tasksForDate.slice(0, 4); // Show up to 4 tasks
    const hiddenTasksCount = tasksForDate.length - 4;
    
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

  // Render tasks for agenda view
  const renderAgendaView = () => {
    const currentWeekDays = weekDays;
    
    return (
      <div className="space-y-6">
        {currentWeekDays.map((day) => {
          const tasksForDay = getTasksForDate(day);
          if (tasksForDay.length === 0) return null;
          
          return (
            <div key={day.toISOString()} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium",
                  isToday(day) ? "bg-primary text-white" : "bg-gray-100"
                )}>
                  {format(day, 'd')}
                </div>
                <div>
                  <h3 className="font-medium">{format(day, 'EEEE')}</h3>
                  <p className="text-sm text-muted-foreground">{format(day, 'MMMM d, yyyy')}</p>
                </div>
              </div>
              
              <div className="pl-12 space-y-2">
                {tasksForDay.map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer",
                      getTaskColor(task)
                    )}
                    onClick={() => onTaskClick(task)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="text-xs">
                        {task.dueDate && format(new Date(task.dueDate), 'h:mm a')}
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm mt-1 opacity-80">{task.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render day view with hourly slots
  const renderDayView = () => {
    const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="space-y-1">
        <div className="text-center mb-4">
          <h2 className="text-xl font-medium">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
        
        {hoursOfDay.map((hour) => {
          const hourDate = setHours(currentDate, hour);
          const tasksAtHour = tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return isSameDay(taskDate, currentDate) && getHours(taskDate) === hour;
          });
          
          return (
            <div key={hour} className="flex items-start py-2 border-t">
              <div className="w-16 text-right pr-4 text-sm text-muted-foreground">
                {format(hourDate, 'h:mm a')}
              </div>
              <div className="flex-1">
                {tasksAtHour.length > 0 ? (
                  <div className="space-y-1">
                    {tasksAtHour.map(task => (
                      <div 
                        key={task.id}
                        className={cn(
                          "p-2 rounded-md cursor-pointer",
                          getTaskColor(task)
                        )}
                        onClick={() => onTaskClick(task)}
                      >
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-xs mt-1">{task.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div 
                    className="h-8 w-full rounded-md border border-dashed border-gray-200 hover:border-gray-300 transition-colors"
                    onClick={() => {
                      setIsTaskFormOpen(true);
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render month view with calendar grid
  const renderMonthView = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Weekday headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="bg-white p-2 text-sm text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar grid */}
          {calendarWeeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date) => {
                const tasksForDate = getTasksForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isCurrentDay = isToday(date);
                
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
                          "min-h-[120px] p-2 bg-white hover:bg-gray-50 transition-colors",
                          !isCurrentMonth && "bg-gray-50/50 text-gray-400",
                          "flex flex-col"
                        )}
                        onClick={() => onDateClick(date)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isCurrentDay && "text-primary"
                            )}
                          >
                            {format(date, 'd')}
                          </span>
                          {isCurrentDay && (
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                          {renderTasksForDate(date, tasksForDate)}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </DragDropContext>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const days = weekDays;
    const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7am to 6pm
    
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <div className="grid grid-cols-8 border-b pb-2 mb-2">
            <div className="text-sm text-center font-medium text-gray-500">Hour</div>
            {days.map((day) => (
              <div key={day.toISOString()} className="text-sm text-center font-medium text-gray-500">
                <div>{format(day, 'EEE')}</div>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mx-auto",
                  isToday(day) ? "bg-primary text-white" : ""
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-1">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
                <div className="text-xs text-right pr-2 py-2 text-muted-foreground">
                  {format(setHours(new Date(), hour), 'h:mm a')}
                </div>
                
                {days.map(day => {
                  const currentHourDate = setHours(day, hour);
                  const tasksAtHour = tasks.filter(task => {
                    if (!task.dueDate) return false;
                    const taskDate = new Date(task.dueDate);
                    return isSameDay(taskDate, day) && getHours(taskDate) === hour;
                  });
                  
                  return (
                    <Droppable 
                      key={currentHourDate.toISOString()} 
                      droppableId={currentHourDate.toISOString()}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="h-16 p-1 border-r border-gray-100 hover:bg-gray-50 transition-colors"
                          onClick={() => onDateClick(currentHourDate)}
                        >
                          {tasksAtHour.length > 0 ? (
                            <div className="h-full">
                              {tasksAtHour.map((task, index) => (
                                <Draggable 
                                  key={`${task.id}|${currentHourDate.toISOString()}`} 
                                  draggableId={`${task.id}|${currentHourDate.toISOString()}`} 
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={cn(
                                        "text-xs p-1 rounded truncate cursor-pointer h-full",
                                        getTaskColor(task)
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
                              {provided.placeholder}
                            </div>
                          ) : (
                            <div className="h-full w-full">
                              {provided.placeholder}
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-md"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>New</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <TaskForm 
                mode="create" 
                initialData={{ dueDate: currentDate }} 
                onSuccess={() => setIsTaskFormOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-md"
              >
                <span className="mr-1">{viewType.charAt(0).toUpperCase() + viewType.slice(1)}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setViewType('month')}>Month</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType('week')}>Week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType('day')}>Day</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType('agenda')}>Agenda</DropdownMenuItem>
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
            onClick={prevPeriod}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-lg font-medium">
            {viewType === 'day' 
              ? format(currentDate, 'MMMM d, yyyy')
              : viewType === 'week'
                ? `${format(weekDays[0], 'MMM d')} - ${format(weekDays[weekDays.length - 1], 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM yyyy')
            }
          </h2>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextPeriod}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Render the appropriate view based on viewType */}
      <div className={cn(
        "transition-all duration-200",
        viewType === 'month' ? "max-w-full" : "max-w-full"
      )}>
        {viewType === 'month' && renderMonthView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'day' && renderDayView()}
        {viewType === 'agenda' && renderAgendaView()}
      </div>
    </div>
  );
};
