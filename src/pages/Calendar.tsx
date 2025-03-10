import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { TaskProvider } from '@/context/TaskContext';
import { TaskHeader } from '@/components/TaskHeader';
import { CalendarView } from '@/components/calendar/CalendarView';
import { CalendarSidebar } from '@/components/calendar/CalendarSidebar';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { Layout, LineChart, Calendar as CalendarIcon, Settings2 } from 'lucide-react';

const CalendarContent = () => {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsSidebarOpen(true);
  };
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };
  
  return (
    <main className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar with logo */}
        <div className="hidden md:flex w-64 flex-col bg-white/90 border-r border-border p-4 h-screen">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="relative w-20 h-20">
              <img 
                src="/lovable-uploads/d8bfce19-2f0d-46f6-9fbe-924f64b656e2.png" 
                alt="Cozy Task Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-patrick text-primary">Cozy Task</span>
          </div>
          <nav className="space-y-2">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/" ? "bg-secondary/50" : "text-muted-foreground"
              )}
            >
              <Layout className="w-5 h-5" />
              Dashboard
            </Link>
            <Link 
              to="/analytics" 
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/analytics" ? "bg-secondary/50" : "text-muted-foreground"
              )}
            >
              <LineChart className="w-5 h-5" />
              Analytics
            </Link>
            <Link 
              to="/calendar" 
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/calendar" ? "bg-secondary/50" : ""
              )}
            >
              <CalendarIcon className="w-5 h-5" />
              Calendar
            </Link>
            <Link 
              to="/settings" 
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-foreground hover:bg-secondary/80 transition-colors",
                location.pathname === "/settings" ? "bg-secondary/50" : "text-muted-foreground"
              )}
            >
              <Settings2 className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
          <div className="max-w-6xl mx-auto">
            <TaskHeader />
            
            <div className="mt-8 space-y-8">
              <CalendarView 
                onDateClick={handleDateClick} 
                onTaskClick={handleTaskClick} 
              />
            </div>
          </div>
        </div>
        
        {/* Right sidebar for task details */}
        <CalendarSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          selectedDate={selectedDate} 
          selectedTask={selectedTask}
        />
      </div>
    </main>
  );
};

const Calendar = () => {
  return (
    <TaskProvider>
      <CalendarContent />
    </TaskProvider>
  );
};

export default Calendar;
