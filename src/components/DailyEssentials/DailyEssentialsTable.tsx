
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, CalendarDays, ChevronLeft, ChevronRight, Check, X, AlertCircle } from "lucide-react";
import { format, subDays, addDays, startOfWeek, endOfWeek, isToday, eachDayOfInterval, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

type Status = "Done" | "Partial" | "Skipped" | "Not Done" | "";

interface EssentialTask {
  id: string;
  name: string;
  statuses: Record<string, Status>;
}

const statusStyles: Record<Status, string> = {
  "Done": "bg-gradient-to-r from-green-500/90 to-green-400/90 text-white",
  "Partial": "bg-gradient-to-r from-yellow-500/90 to-amber-400/90 text-white",
  "Skipped": "bg-gradient-to-r from-blue-500/90 to-sky-400/90 text-white",
  "Not Done": "bg-gradient-to-r from-red-500/90 to-rose-400/90 text-white",
  "": "bg-secondary text-white/60"
};

export function DailyEssentialsTable() {
  const [tasks, setTasks] = useState<EssentialTask[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { toast } = useToast();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weekRangeText = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  
  const isCurrentWeek = isSameDay(weekStart, startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const goToPreviousWeek = () => {
    setCurrentDate(subDays(weekStart, 7));
  };
  
  const goToNextWeek = () => {
    if (!isCurrentWeek) {
      setCurrentDate(addDays(weekStart, 7));
    }
  };
  
  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

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

  useEffect(() => {
    try {
      localStorage.setItem("dailyEssentialTasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }, [tasks]);

  const addTask = () => {
    if (newTaskName.trim() === "") return;
    
    const newTask: EssentialTask = {
      id: Date.now().toString(),
      name: newTaskName.trim(),
      statuses: {}
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskName("");
    setIsAddingTask(false);
    
    toast({
      title: "Task added",
      description: `"${newTaskName.trim()}" has been added to your daily essentials.`,
    });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Task removed",
      description: "The task has been removed from your daily essentials.",
    });
  };

  const updateTaskStatus = (taskId: string, date: string, status: Status) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedStatuses = { ...task.statuses };
        
        if (status === "") {
          delete updatedStatuses[date];
        } else {
          updatedStatuses[date] = status;
        }
        
        return {
          ...task,
          statuses: updatedStatuses
        };
      }
      return task;
    }));
  };

  const getStatus = (task: EssentialTask, date: string): Status => {
    return task.statuses[date] || "";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border-white/5 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Daily Essentials</CardTitle>
              <CardDescription className="text-white/70">
                Track your essential daily tasks
              </CardDescription>
            </div>
            <Button
              variant="outline" 
              onClick={() => setIsAddingTask(true)}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPreviousWeek}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="px-2 py-1 bg-white/10 rounded-md text-white font-medium">
                {weekRangeText}
              </span>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToNextWeek}
                disabled={isCurrentWeek}
                className={cn(
                  "bg-white/10 border-white/20 text-white",
                  isCurrentWeek ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {!isCurrentWeek && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToCurrentWeek}
                  className="ml-2 bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs"
                >
                  <CalendarDays className="h-3 w-3 mr-1" />
                  Current Week
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-white/70">Done</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-white/70">Partial</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-white/70">Skipped</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs text-white/70">Not Done</span>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {isAddingTask && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Enter task name (e.g., Meditation, Reading, Exercise)"
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        autoFocus
                      />
                      <Button 
                        onClick={addTask}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAddingTask(false);
                          setNewTaskName("");
                        }}
                        className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {tasks.length === 0 ? (
            <motion.div 
              className="p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-white/60" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No tasks added yet</h3>
              <p className="text-white/60 mb-4">
                Add your daily essential tasks to start tracking your habits
              </p>
              <Button 
                onClick={() => setIsAddingTask(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            </motion.div>
          ) : (
            <div className="overflow-x-auto pb-2">
              <ScrollArea className="h-[380px]">
                <motion.table 
                  className="w-full"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <thead>
                    <tr>
                      <th className="text-left pb-4 w-[200px]">
                        <span className="text-white/80 font-medium">Task Name</span>
                      </th>
                      {weekDates.map((date) => (
                        <th key={date.toISOString()} className="px-1 pb-4 w-[80px]">
                          <div className={cn(
                            "flex flex-col items-center rounded-md py-1 px-2",
                            isToday(date) ? "bg-white/10" : ""
                          )}>
                            <span className="text-white/80 text-xs font-normal">
                              {format(date, 'EEE')}
                            </span>
                            <span className={cn(
                              "text-sm font-medium",
                              isToday(date) ? "text-white" : "text-white/70"
                            )}>
                              {format(date, 'd')}
                            </span>
                          </div>
                        </th>
                      ))}
                      <th className="w-[50px]"></th>
                    </tr>
                  </thead>
                  <motion.tbody className="divide-y divide-white/10">
                    {tasks.map((task) => (
                      <motion.tr 
                        key={task.id}
                        variants={itemVariants}
                        className="group"
                      >
                        <td className="py-2 pr-4">
                          <span className="font-medium text-white">{task.name}</span>
                        </td>
                        {weekDates.map((date) => {
                          const dateStr = date.toISOString().split('T')[0];
                          const status = getStatus(task, dateStr);
                          
                          return (
                            <td key={dateStr} className="px-1 py-2">
                              <Select
                                value={status}
                                onValueChange={(value: Status) => updateTaskStatus(task.id, dateStr, value)}
                              >
                                <SelectTrigger 
                                  className={cn(
                                    "w-16 h-7 justify-center border-0 shadow-sm focus:ring-1 focus:ring-white/30 font-medium text-xs",
                                    statusStyles[status] || "bg-secondary text-white/60"
                                  )}
                                >
                                  {status ? (
                                    <SelectValue>
                                      {status === "Done" && <Check className="h-3.5 w-3.5" />}
                                      {status === "Partial" && <span className="text-xs">50%</span>}
                                      {status === "Skipped" && <span className="text-xs">Skip</span>}
                                      {status === "Not Done" && <X className="h-3.5 w-3.5" />}
                                    </SelectValue>
                                  ) : (
                                    <SelectValue>—</SelectValue>
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">Not Set</SelectItem>
                                  <SelectItem value="Done">Done</SelectItem>
                                  <SelectItem value="Partial">Partial</SelectItem>
                                  <SelectItem value="Skipped">Skipped</SelectItem>
                                  <SelectItem value="Not Done">Not Done</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          );
                        })}
                        <td className="py-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-white/60" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </motion.table>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
