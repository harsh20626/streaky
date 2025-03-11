
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define interface for a daily essential task
interface EssentialTask {
  id: string;
  name: string;
  statuses: Record<string, string>;
}

// Helper to generate dates for the last week and next few days
const generateDates = (daysBack = 2, daysForward = 4): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  // Add past days
  for (let i = daysBack; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  // Add today
  dates.push(today.toISOString().split('T')[0]);
  
  // Add future days
  for (let i = 1; i <= daysForward; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Format date for display (e.g., "10/03")
const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// Determine if a date is today
const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

export function DailyEssentialsTable() {
  const [tasks, setTasks] = useState<EssentialTask[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [dates, setDates] = useState<string[]>(generateDates());
  const { toast } = useToast();
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("dailyEssentialTasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("dailyEssentialTasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }, [tasks]);
  
  const addTask = () => {
    if (!newTaskName.trim()) return;
    
    // Create a new task with empty statuses for all dates
    const statuses: Record<string, string> = {};
    dates.forEach(date => {
      statuses[date] = "";
    });
    
    const newTask: EssentialTask = {
      id: Date.now().toString(),
      name: newTaskName,
      statuses
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskName("");
    
    toast({
      title: "Task Added",
      description: `Added "${newTaskName}" to daily essentials.`,
    });
  };
  
  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Task Removed",
      description: "Task has been removed from daily essentials.",
    });
  };
  
  const updateStatus = (taskId: string, date: string, status: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          statuses: {
            ...task.statuses,
            [date]: status
          }
        };
      }
      return task;
    }));
  };
  
  // Status options for the dropdown
  const statusOptions = [
    { value: "not-set", label: "Not set" },
    { value: "Done", label: "Done" },
    { value: "Not Done", label: "Not Done" },
    { value: "Partial", label: "Partial" },
    { value: "Skipped", label: "Skipped" }
  ];
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Add a new daily essential task..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-todo-gray/50"
        />
        <Button onClick={addTask} type="button">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <ScrollArea className="h-[calc(100vh-320px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No.</TableHead>
                <TableHead>Task</TableHead>
                {dates.map((date) => (
                  <TableHead 
                    key={date} 
                    className={cn(
                      "text-center min-w-[100px]",
                      isToday(date) && "bg-todo-purple/30"
                    )}
                  >
                    {formatDateDisplay(date)}
                    {isToday(date) && <span className="ml-1">(Today)</span>}
                  </TableHead>
                ))}
                <TableHead className="w-12 text-center">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={dates.length + 3} className="text-center py-6 text-muted-foreground">
                    No daily essential tasks added yet. Add your first task above.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task, index) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    {dates.map((date) => (
                      <TableCell key={`${task.id}-${date}`} className="text-center">
                        <Select
                          value={task.statuses[date] || "not-set"}
                          onValueChange={(value) => updateStatus(task.id, date, value)}
                        >
                          <SelectTrigger className={cn(
                            "h-8 w-full",
                            task.statuses[date] === "Done" && "bg-green-900/30 text-green-300",
                            task.statuses[date] === "Not Done" && "bg-red-900/30 text-red-300",
                            task.statuses[date] === "Partial" && "bg-yellow-900/30 text-yellow-300",
                            task.statuses[date] === "Skipped" && "bg-gray-900/30 text-gray-300",
                          )}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeTask(task.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      <div className="mt-4">
        <Button 
          className="w-full bg-todo-purple hover:bg-todo-purple/90"
          onClick={() => {
            toast({
              title: "Progress Saved",
              description: "Your daily essentials progress has been saved.",
            });
          }}
        >
          Save Progress
        </Button>
      </div>
    </div>
  );
}
