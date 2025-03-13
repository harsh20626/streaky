
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, Trash2, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EssentialTask {
  id: string;
  name: string;
  statuses: Record<string, string>;
}

const generateDates = (startDate: Date, daysBack = 3, daysForward = 3): string[] => {
  const dates: string[] = [];
  const today = startDate;
  
  for (let i = daysBack; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  dates.push(today.toISOString().split('T')[0]);
  
  for (let i = 1; i <= daysForward; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

export function DailyEssentialsTable() {
  const [tasks, setTasks] = useState<EssentialTask[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [dates, setDates] = useState<string[]>(generateDates(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  // Update dates when selected week changes
  useEffect(() => {
    const weekStart = startOfWeek(selectedWeek);
    const newDates = generateDates(weekStart, 0, 6);
    setDates(newDates);
  }, [selectedWeek]);
  
  // Update dates at midnight (for date changing)
  useEffect(() => {
    // Initial load of tasks
    try {
      const savedTasks = localStorage.getItem("dailyEssentialTasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
    
    // Set up timer to update dates at midnight
    const checkForDateChange = () => {
      const newDates = generateDates(new Date());
      const currentToday = new Date().toISOString().split('T')[0];
      const lastDate = dates[dates.indexOf(currentToday) + 1];
      
      // If the day has changed, update our dates and add new status slots
      if (!dates.includes(currentToday)) {
        setDates(newDates);
        
        // Update all tasks to include the new dates
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            const updatedStatuses = { ...task.statuses };
            
            // Add empty status slots for any new dates
            newDates.forEach(date => {
              if (!updatedStatuses[date]) {
                updatedStatuses[date] = "";
              }
            });
            
            return {
              ...task,
              statuses: updatedStatuses
            };
          });
        });
      }
    };
    
    // Check immediately
    checkForDateChange();
    
    // Set up interval to check for date change - check every hour
    const interval = setInterval(checkForDateChange, 1000 * 60 * 60);
    
    return () => clearInterval(interval);
  }, [dates]);
  
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

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prev => addWeeks(prev, 1));
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedWeek(date);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Week selector */}
      <Card className="bg-sidebar/10 border-white/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <h2 className="text-lg font-semibold">Daily Essentials</h2>
              <p className="text-sm text-white/60">Track your daily habits and routines</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="min-w-[150px]">
                    <CalendarIcon className="h-4 w-4 mr-2" /> 
                    Week of {format(startOfWeek(selectedWeek), "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    
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
        <ScrollArea 
          className="h-[calc(100vh-320px)]"
        >
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 sticky left-0 z-20 bg-todo-dark">No.</TableHead>
                  <TableHead className="sticky left-12 z-20 bg-todo-dark">Task</TableHead>
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
                      <TableCell className="font-medium sticky left-0 z-10 bg-todo-dark">{index + 1}</TableCell>
                      <TableCell className="sticky left-12 z-10 bg-todo-dark">{task.name}</TableCell>
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
                          className="text-red-400 bg-red-900/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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
