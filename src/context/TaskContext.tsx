import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskTag, TaskViewMode, TaskSortOption, TaskFilterOption } from '@/types/task';
import { getSubscriptionStatus } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
// ... existing code ...

interface TaskContextProps {
  tasks: Task[];
  viewMode: TaskViewMode;
  sortOption: TaskSortOption;
  filterOption: TaskFilterOption;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, taskData: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  setViewMode: (mode: TaskViewMode) => void;
  setSortOption: (option: TaskSortOption) => void;
  setFilterOption: (option: TaskFilterOption) => void;
  filteredAndSortedTasks: Task[];
  availableTags: TaskTag[];
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const { data: subscription } = await getSubscriptionStatus();
      
      if (subscription?.status === 'active') {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('createdAt', { ascending: false });

        if (!error) {
          setTasks(data.map(task => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : null
          })));
        }
      } else {
        const localTasks = localStorage.getItem('cozy-tasks');
        if (localTasks) {
          try {
            const parsed = JSON.parse(localTasks);
            setTasks(parsed.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt),
              dueDate: task.dueDate ? new Date(task.dueDate) : null
            })));
          } catch (e) {
            console.error('Local storage parse error:', e);
          }
        }
      }
    };

    loadTasks();
  }, []);
  
  const [viewMode, setViewMode] = useState<TaskViewMode>('list');
  const [sortOption, setSortOption] = useState<TaskSortOption>('date');
  const [filterOption, setFilterOption] = useState<TaskFilterOption>('all');

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    const syncTasks = async () => {
      const { data: subscription } = await getSubscriptionStatus();
      
      if (subscription?.status === 'active') {
        const { error } = await supabase
          .from('tasks')
          .upsert(tasks.map(task => ({
            ...task,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            dueDate: task.dueDate?.toISOString()
          })));
        
        if (error) {
          toast({
            title: 'Sync Error',
            description: 'Failed to save tasks to cloud',
            variant: 'destructive'
          });
        }
      } else {
        localStorage.setItem('cozy-tasks', JSON.stringify(tasks));
      }
    };

    syncTasks();
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks((prev) => [...prev, newTask]);
    toast({
      title: "Success",
      description: "Task added successfully"
    });
  };

  const updateTask = (taskId: string, taskData: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, ...taskData, updatedAt: new Date() }
          : task
      )
    );
    toast({
      title: "Success",
      description: "Task updated successfully"
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({
      title: "Success",
      description: "Task deleted successfully"
    });
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'completed' ? 'pending' : 'completed',
              updatedAt: new Date(),
            }
          : task
      )
    );
  };

  // Get all available tags from existing tasks
  const availableTags = Array.from(
    new Set(tasks.flatMap((task) => task.tags))
  ) as TaskTag[];

  // Filter and sort tasks based on current options
  const filteredAndSortedTasks = React.useMemo(() => {
    let filteredTasks = [...tasks];
    
    // Apply filters
    if (filterOption === 'completed') {
      filteredTasks = filteredTasks.filter((task) => task.status === 'completed');
    } else if (filterOption === 'pending') {
      filteredTasks = filteredTasks.filter((task) => task.status === 'pending');
    } else if (filterOption === 'overdue') {
      const now = new Date();
      filteredTasks = filteredTasks.filter(
        (task) => 
          task.status === 'pending' && 
          task.dueDate && 
          new Date(task.dueDate) < now
      );
    }
    
    // Apply sorting
    return filteredTasks.sort((a, b) => {
      if (sortOption === 'date') {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      } else if (sortOption === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return (
          (priorityValues[b.priority] || 0) - (priorityValues[a.priority] || 0)
        );
      } else if (sortOption === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, filterOption, sortOption]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        viewMode,
        sortOption,
        filterOption,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        setViewMode,
        setSortOption,
        setFilterOption,
        filteredAndSortedTasks,
        availableTags,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
