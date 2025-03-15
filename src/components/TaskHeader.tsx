
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TaskForm } from '@/components/TaskForm';
import { Plus, Search } from 'lucide-react';

export const TaskHeader: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { searchQuery, setSearchQuery } = useTaskContext();
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-patrick">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your tasks and boost productivity</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="futuristic-button">
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-md border border-white/30">
            <TaskForm mode="create" onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="futuristic-input w-full pl-10 pr-4 py-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
