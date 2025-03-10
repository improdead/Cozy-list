
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task, TaskPriority, TaskTag } from '@/types/task';
import { useTaskContext } from '@/context/TaskContext';
import { getSubscriptionStatus } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { toast, useToast } from '@/hooks/use-toast';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().nullable().optional(),
});

// Update TaskFormProps to include initialData
type TaskFormProps = {
  task?: Task;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  initialData?: {
    dueDate?: Date | null;
    description?: string;
    priority?: TaskPriority;
    title?: string;
  };
};

export const TaskForm: React.FC<TaskFormProps> = ({ 
  task, 
  mode = 'create',
  onSuccess,
  initialData = {}
}) => {
  const { addTask, updateTask, availableTags } = useTaskContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>(
    task?.tags || []
  );
  const [newTag, setNewTag] = useState('');

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || initialData.title || '',
      description: task?.description || initialData.description || '',
      priority: task?.priority || initialData.priority || 'medium',
      dueDate: task?.dueDate || initialData.dueDate || null,
    },
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    setIsLoading(true);
    const { data: subscription } = await getSubscriptionStatus();
    
    if (subscription?.status !== 'active') {
      toast({
        title: 'Premium Feature',
        description: 'Upgrade to premium to save tasks permanently',
        variant: 'destructive',
      });
    }

    try {
      if (mode === 'create') {
        addTask({
          title: data.title,
          description: data.description || '',
          status: 'pending',
          tags: selectedTags,
          priority: data.priority,
          dueDate: data.dueDate,
        });
      } else if (task) {
        updateTask(task.id, {
          ...data,
          tags: selectedTags,
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (mode === 'create') {
        form.reset({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: null,
        });
        setSelectedTags([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag as TaskTag)) {
      setSelectedTags([...selectedTags, newTag as TaskTag]);
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: TaskTag) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const addExistingTag = (tag: TaskTag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6 animate-fade-in"
      >
        <h2 className="text-2xl font-patrick">
          {mode === 'create' ? 'Add New Task' : 'Edit Task'}
        </h2>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a task title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add more details about this task..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Tags</FormLabel>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map((tag) => (
              <div 
                key={tag}
                className={cn(
                  'tag group flex items-center gap-1 pr-1',
                  tag === 'work' ? 'tag-work' : '',
                  tag === 'personal' ? 'tag-personal' : '',
                  tag === 'urgent' ? 'tag-urgent' : '',
                )}
              >
                <span>{tag}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {availableTags.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-1">Existing tags:</p>
              <div className="flex flex-wrap gap-1">
                {availableTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map(tag => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => addExistingTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))
                }
              </div>
            </div>
          )}
        </div>
        
        <Button type="submit" className="w-full">
          {mode === 'create' ? 'Create Task' : 'Update Task'}
        </Button>
      </form>
    </Form>
  );
};

// This function is now properly integrated into the component above
// and uses the imported functions from supabase.ts
