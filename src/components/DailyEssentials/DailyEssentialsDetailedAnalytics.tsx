
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart
} from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface EssentialTask {
  id: string;
  name: string;
  statuses: Record<string, string>;
}

export function DailyEssentialsDetailedAnalytics() {
  const [tasks, setTasks] = useState<EssentialTask[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("week");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  });
  const [weeklyStats, setWeeklyStats] = useState<{
    completed: number;
    partial: number;
    skipped: number;
    notDone: number;
    total: number;
    completionRate: number;
    dates: string[];
    dailyRates: number[];
  }>({
    completed: 0,
    partial: 0,
    skipped: 0,
    notDone: 0,
    total: 0,
    completionRate: 0,
    dates: [],
    dailyRates: []
  });
  const [allTimeStats, setAllTimeStats] = useState({
    bestDay: "",
    bestRate: 0,
    totalCompleted: 0,
    longestStreak: 0,
    averageCompletion: 0
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, number>>({});
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});

  // Load tasks from localStorage
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

  // Update date range when selected week changes
  useEffect(() => {
    const start = startOfWeek(selectedWeek);
    const end = endOfWeek(selectedWeek);
    setDateRange({ start, end });
    
    // Generate dates for the week
    const datesInWeek = eachDayOfInterval({ start, end });
    const dates = datesInWeek.map(date => date.toISOString().split('T')[0]);
    
    // Calculate weekly stats
    if (tasks.length > 0) {
      let completed = 0;
      let partial = 0;
      let skipped = 0;
      let notDone = 0;
      
      const dailyRates: number[] = [];
      
      dates.forEach(date => {
        let dailyCompleted = 0;
        let dailyPartial = 0;
        let dailySkipped = 0;
        let dailyNotDone = 0;
        
        tasks.forEach(task => {
          const status = task.statuses[date] || "";
          
          // Count for the whole week
          if (status === "Done") completed++;
          else if (status === "Partial") partial++;
          else if (status === "Skipped") skipped++;
          else if (status === "Not Done") notDone++;
          
          // Count for the individual day
          if (status === "Done") dailyCompleted++;
          else if (status === "Partial") dailyPartial++;
          else if (status === "Skipped") dailySkipped++;
          else if (status === "Not Done") dailyNotDone++;
        });
        
        const dailyTotal = tasks.length;
        const dailyCompletionRate = dailyTotal > 0 
          ? Math.round(((dailyCompleted + (dailyPartial * 0.5)) / dailyTotal) * 100) 
          : 0;
        
        dailyRates.push(dailyCompletionRate);
      });
      
      const total = tasks.length * 7; // 7 days
      const completionRate = total > 0 
        ? Math.round(((completed + (partial * 0.5)) / total) * 100) 
        : 0;
      
      setWeeklyStats({
        completed,
        partial,
        skipped,
        notDone,
        total,
        completionRate,
        dates,
        dailyRates
      });
    }
  }, [selectedWeek, tasks]);

  // Calculate all-time stats and heatmap data
  useEffect(() => {
    if (tasks.length === 0) return;
    
    // Get all dates with statuses
    const allDates = new Set<string>();
    const dateCompletionRates: Record<string, { completed: number, total: number }> = {};
    
    tasks.forEach(task => {
      Object.keys(task.statuses).forEach(date => {
        allDates.add(date);
        
        if (!dateCompletionRates[date]) {
          dateCompletionRates[date] = { completed: 0, total: 0 };
        }
        
        const status = task.statuses[date];
        if (status === "Done") {
          dateCompletionRates[date].completed += 1;
        } else if (status === "Partial") {
          dateCompletionRates[date].completed += 0.5;
        }
        
        dateCompletionRates[date].total += 1;
      });
    });
    
    // Calculate completion rate for each date
    const dateRates: Record<string, number> = {};
    let bestDay = "";
    let bestRate = 0;
    let totalCompleted = 0;
    let totalTasks = 0;
    
    Object.entries(dateCompletionRates).forEach(([date, stats]) => {
      const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      dateRates[date] = rate;
      
      if (rate > bestRate) {
        bestRate = rate;
        bestDay = date;
      }
      
      totalCompleted += stats.completed;
      totalTasks += stats.total;
    });
    
    // Calculate longest streak
    const sortedDates = Array.from(allDates).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const rate = dateRates[date] || 0;
      
      if (rate >= 50) { // Consider a day successful if at least 50% completed
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    // Set all-time stats
    setAllTimeStats({
      bestDay: bestDay ? format(parseISO(bestDay), 'PPP') : "None",
      bestRate,
      totalCompleted: Math.round(totalCompleted),
      longestStreak,
      averageCompletion: totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0
    });
    
    // Set heatmap data
    setHeatmapData(dateRates);
    
  }, [tasks]);

  // Calculate category breakdown
  useEffect(() => {
    if (tasks.length === 0) return;
    
    // Simple categorization based on task name keywords
    // In a real app, you would have actual categories
    const categories: Record<string, number> = {
      Health: 0,
      Work: 0,
      Personal: 0,
      Other: 0
    };
    
    tasks.forEach(task => {
      const name = task.name.toLowerCase();
      if (name.includes("exercise") || name.includes("water") || name.includes("sleep") || name.includes("meditate")) {
        categories.Health++;
      } else if (name.includes("work") || name.includes("email") || name.includes("meeting") || name.includes("project")) {
        categories.Work++;
      } else if (name.includes("read") || name.includes("journal") || name.includes("hobby") || name.includes("family")) {
        categories.Personal++;
      } else {
        categories.Other++;
      }
    });
    
    setCategoryBreakdown(categories);
  }, [tasks]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center bg-sidebar/10 p-4 rounded-lg">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Daily Essentials Analytics</h2>
          <p className="text-sm text-white/70">
            Detailed insights into your daily habits and routines
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="min-w-[150px]">
                <CalendarIcon className="h-4 w-4 mr-2" /> 
                {format(dateRange.start, "MMM d")} - {format(dateRange.end, "MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <CalendarComponent
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
      
      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mx-auto bg-sidebar">
          <TabsTrigger value="week">Weekly Overview</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
        </TabsList>

        {/* Weekly Overview Tab */}
        <TabsContent value="week" className="pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="weekly"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {/* Weekly Stats Summary */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-todo-purple/30 to-todo-purple/10 border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Weekly Completion</p>
                        <p className="text-2xl font-bold mt-1">{weeklyStats.completionRate}%</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-todo-purple/20 flex items-center justify-center">
                        <Target className="h-5 w-5 text-todo-purple" />
                      </div>
                    </div>
                    <Progress 
                      value={weeklyStats.completionRate} 
                      className="h-1.5 mt-3 bg-white/10" 
                    />
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Completed</p>
                        <p className="text-2xl font-bold mt-1">{weeklyStats.completed}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                    <Progress 
                      value={weeklyStats.total ? (weeklyStats.completed / weeklyStats.total) * 100 : 0} 
                      className="h-1.5 mt-3 bg-white/10" 
                    />
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Total Tasks</p>
                        <p className="text-2xl font-bold mt-1">{weeklyStats.total}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-900/20 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                    <Progress 
                      value={100} 
                      className="h-1.5 mt-3 bg-white/10" 
                    />
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Week Period</p>
                        <p className="text-lg font-bold mt-1">{format(dateRange.start, "MMM d")}-{format(dateRange.end, "d")}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-orange-900/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-orange-400" />
                      </div>
                    </div>
                    <div className="flex gap-1 mt-3">
                      {weeklyStats.dailyRates.map((value, i) => (
                        <div 
                          key={i}
                          className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden"
                        >
                          <div 
                            className="h-full bg-orange-400"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Daily Breakdown Chart */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-white/5">
                  <CardHeader>
                    <CardTitle>Daily Completion Rates</CardTitle>
                    <CardDescription>Completion rates for each day of the selected week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end h-64 gap-4">
                      {weeklyStats.dailyRates.map((value, i) => {
                        const date = weeklyStats.dates[i] ? new Date(weeklyStats.dates[i]) : null;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <motion.div 
                              className={cn(
                                "w-full rounded-t-md transition-all",
                                value >= 70 ? "bg-green-500" : 
                                value >= 40 ? "bg-yellow-500" : 
                                "bg-red-500"
                              )}
                              style={{ height: `${value}%` }}
                              initial={{ height: 0 }}
                              animate={{ height: `${value}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                            />
                            <div className="text-center mt-2">
                              <span className="block text-xs text-white/60">
                                {date ? format(date, "EEE") : ""}
                              </span>
                              <span className="block text-sm font-medium">
                                {value}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Status Breakdown */}
                <Card className="border-white/5">
                  <CardHeader>
                    <CardTitle>Status Breakdown</CardTitle>
                    <CardDescription>Distribution of task statuses for the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Visual representation */}
                      <div className="flex items-center justify-center">
                        <div className="relative h-40 w-40">
                          {/* Completed */}
                          <motion.div 
                            className="absolute inset-0 rounded-full border-8 border-green-500"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            style={{ 
                              clipPath: weeklyStats.total > 0 
                                ? `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * weeklyStats.completed / weeklyStats.total)}% ${50 - 50 * Math.sin(2 * Math.PI * weeklyStats.completed / weeklyStats.total)}%, 50% 50%)` 
                                : 'none' 
                            }}
                          />
                          {/* Partial */}
                          <motion.div 
                            className="absolute inset-0 rounded-full border-8 border-yellow-500"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            style={{ 
                              clipPath: weeklyStats.total > 0 
                                ? `polygon(50% 50%, ${50 + 50 * Math.cos(2 * Math.PI * weeklyStats.completed / weeklyStats.total)}% ${50 - 50 * Math.sin(2 * Math.PI * weeklyStats.completed / weeklyStats.total)}%, ${50 + 50 * Math.cos(2 * Math.PI * (weeklyStats.completed + weeklyStats.partial) / weeklyStats.total)}% ${50 - 50 * Math.sin(2 * Math.PI * (weeklyStats.completed + weeklyStats.partial) / weeklyStats.total)}%, 50% 50%)` 
                                : 'none' 
                            }}
                          />
                          {/* Not Done */}
                          <motion.div 
                            className="absolute inset-0 rounded-full border-8 border-red-500"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            style={{ 
                              clipPath: weeklyStats.total > 0 
                                ? `polygon(50% 50%, ${50 + 50 * Math.cos(2 * Math.PI * (weeklyStats.completed + weeklyStats.partial) / weeklyStats.total)}% ${50 - 50 * Math.sin(2 * Math.PI * (weeklyStats.completed + weeklyStats.partial) / weeklyStats.total)}%, ${50 + 50 * Math.cos(2 * Math.PI * (weeklyStats.completed + weeklyStats.partial + weeklyStats.notDone) / weeklyStats.total)}% ${50 - 50 * Math.sin(2 * Math.PI * (weeklyStats.completed + weeklyStats.partial + weeklyStats.notDone) / weeklyStats.total)}%, 50% 50%)` 
                                : 'none' 
                            }}
                          />
                          {/* Skipped */}
                          <motion.div 
                            className="absolute inset-0 rounded-full border-8 border-gray-500"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            style={{ 
                              clipPath: weeklyStats.total > 0 
                                ? `polygon(50% 50%, ${50 + 50 * Math.cos(2 * Math.PI * (weeklyStats.completed + weeklyStats.partial + weeklyStats.notDone) / weeklyStats.total)}% ${50 - 50 * Math.sin(2 * Math.PI * (weeklyStats.completed + weeklyStats.partial + weeklyStats.notDone) / weeklyStats.total)}%, ${50 + 50 * Math.cos(0)}% ${50 - 50 * Math.sin(0)}%, 50% 50%)` 
                                : 'none' 
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Legend and stats */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70 flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5" />
                              Completed
                            </span>
                            <span className="text-sm font-medium">
                              {weeklyStats.completed} ({weeklyStats.total > 0 ? Math.round((weeklyStats.completed / weeklyStats.total) * 100) : 0}%)
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70 flex items-center">
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5" />
                              Partial
                            </span>
                            <span className="text-sm font-medium">
                              {weeklyStats.partial} ({weeklyStats.total > 0 ? Math.round((weeklyStats.partial / weeklyStats.total) * 100) : 0}%)
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70 flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5" />
                              Not Done
                            </span>
                            <span className="text-sm font-medium">
                              {weeklyStats.notDone} ({weeklyStats.total > 0 ? Math.round((weeklyStats.notDone / weeklyStats.total) * 100) : 0}%)
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-white/70 flex items-center">
                              <div className="w-3 h-3 rounded-full bg-gray-500 mr-1.5" />
                              Skipped
                            </span>
                            <span className="text-sm font-medium">
                              {weeklyStats.skipped} ({weeklyStats.total > 0 ? Math.round((weeklyStats.skipped / weeklyStats.total) * 100) : 0}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Historical Data Tab */}
        <TabsContent value="history" className="pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="history"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {/* All-time stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-todo-purple/30 to-todo-purple/10 border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">All-time Completion</p>
                        <p className="text-2xl font-bold mt-1">{allTimeStats.averageCompletion}%</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-todo-purple/20 flex items-center justify-center">
                        <PieChart className="h-5 w-5 text-todo-purple" />
                      </div>
                    </div>
                    <Progress 
                      value={allTimeStats.averageCompletion} 
                      className="h-1.5 mt-3 bg-white/10" 
                    />
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Total Completed</p>
                        <p className="text-2xl font-bold mt-1">{allTimeStats.totalCompleted}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                    <div className="h-1.5 mt-3 bg-white/10 w-full">
                      <div className="h-full bg-green-400 animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Longest Streak</p>
                        <p className="text-2xl font-bold mt-1">{allTimeStats.longestStreak} days</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-900/20 flex items-center justify-center">
                        <Award className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="h-1.5 mt-3 bg-white/10 w-full">
                      <div className="h-full bg-blue-400" style={{ width: `${Math.min(allTimeStats.longestStreak * 10, 100)}%` }}></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 border-none shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Best Day</p>
                        <p className="text-lg font-bold mt-1">{allTimeStats.bestDay}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-orange-900/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-orange-400" />
                      </div>
                    </div>
                    <div className="h-1.5 mt-3 bg-white/10 w-full">
                      <div className="h-full bg-orange-400" style={{ width: `${allTimeStats.bestRate}%` }}></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Calendar Heatmap for completion rates */}
              <motion.div variants={itemVariants}>
                <Card className="border-white/5">
                  <CardHeader>
                    <CardTitle>Completion Calendar</CardTitle>
                    <CardDescription>Heatmap of your daily task completion rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {/* Days of week labels */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs text-white/60 font-medium py-1">
                          {day}
                        </div>
                      ))}
                      
                      {/* Placeholder for actual heatmap cells - in a real app, generate these dynamically */}
                      {Array.from({ length: 35 }).map((_, index) => {
                        const randomValue = Math.floor(Math.random() * 100);
                        return (
                          <motion.div 
                            key={index}
                            className={cn(
                              "aspect-square rounded-md border border-white/10",
                              randomValue >= 80 ? "bg-green-500" :
                              randomValue >= 60 ? "bg-green-500/70" :
                              randomValue >= 40 ? "bg-green-500/50" :
                              randomValue >= 20 ? "bg-green-500/30" :
                              randomValue > 0 ? "bg-green-500/10" :
                              "bg-white/5"
                            )}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.005, duration: 0.3 }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10"></div>
                        <span className="text-xs text-white/60">None</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-green-500/10"></div>
                        <span className="text-xs text-white/60">Low</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-green-500/30"></div>
                        <span className="text-xs text-white/60"></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-green-500/50"></div>
                        <span className="text-xs text-white/60">Medium</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-green-500/70"></div>
                        <span className="text-xs text-white/60"></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                        <span className="text-xs text-white/60">High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Category Breakdown */}
              <motion.div variants={itemVariants}>
                <Card className="border-white/5">
                  <CardHeader>
                    <CardTitle>Task Categories</CardTitle>
                    <CardDescription>Breakdown of your tasks by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Category Visualization */}
                      <div className="relative h-60">
                        {Object.entries(categoryBreakdown).map(([category, count], index) => {
                          const total = Object.values(categoryBreakdown).reduce((acc, val) => acc + val, 0);
                          const percentage = total > 0 ? (count / total) * 100 : 0;
                          const colors = {
                            Health: "bg-green-500",
                            Work: "bg-blue-500",
                            Personal: "bg-purple-500",
                            Other: "bg-gray-500"
                          };
                          const colorClass = colors[category as keyof typeof colors] || "bg-gray-500";
                          
                          return (
                            <motion.div
                              key={category}
                              className={`absolute bottom-0 rounded-t-md ${colorClass}`}
                              style={{
                                left: `${index * 25}%`,
                                width: '20%',
                                height: `${percentage}%`
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: index * 0.2 }}
                            />
                          );
                        })}
                      </div>
                      
                      {/* Category Legend */}
                      <div className="space-y-4">
                        {Object.entries(categoryBreakdown).map(([category, count]) => {
                          const total = Object.values(categoryBreakdown).reduce((acc, val) => acc + val, 0);
                          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                          const colors = {
                            Health: "bg-green-500",
                            Work: "bg-blue-500",
                            Personal: "bg-purple-500",
                            Other: "bg-gray-500"
                          };
                          const colorClass = colors[category as keyof typeof colors] || "bg-gray-500";
                          
                          return (
                            <div key={category} className="flex justify-between items-center">
                              <span className="text-sm text-white/70 flex items-center">
                                <div className={`w-3 h-3 rounded-full ${colorClass} mr-1.5`} />
                                {category}
                              </span>
                              <span className="text-sm font-medium">
                                {count} ({percentage}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
