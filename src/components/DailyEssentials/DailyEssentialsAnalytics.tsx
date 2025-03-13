
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle2, Clock, Target, TrendingUp, Award } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface EssentialTask {
  id: string;
  name: string;
  statuses: Record<string, string>;
}

export function DailyEssentialsAnalytics() {
  const [tasks, setTasks] = useState<EssentialTask[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [todayStats, setTodayStats] = useState({
    completed: 0,
    partial: 0,
    skipped: 0,
    notDone: 0,
    notSet: 0,
    total: 0,
    completionRate: 0
  });
  const [weeklyTrend, setWeeklyTrend] = useState<number[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  
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
  
  // Generate dates (last 7 days)
  useEffect(() => {
    const generateDates = () => {
      const dates: string[] = [];
      const today = new Date();
      
      // Include today and 6 days before
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
      
      return dates;
    };
    
    setDates(generateDates());
  }, []);
  
  // Calculate statistics
  useEffect(() => {
    if (tasks.length === 0 || dates.length === 0) return;
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's stats
    let completed = 0;
    let partial = 0;
    let skipped = 0;
    let notDone = 0;
    let notSet = 0;
    
    tasks.forEach(task => {
      const status = task.statuses[today] || "";
      if (status === "Done") completed++;
      else if (status === "Partial") partial++;
      else if (status === "Skipped") skipped++;
      else if (status === "Not Done") notDone++;
      else notSet++;
    });
    
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round(((completed + (partial * 0.5)) / total) * 100) : 0;
    
    setTodayStats({ 
      completed, 
      partial, 
      skipped, 
      notDone,
      notSet,
      total,
      completionRate
    });
    
    // Calculate weekly trend
    const trend = dates.map(date => {
      let completedCount = 0;
      let partialCount = 0;
      let totalTasks = 0;
      
      tasks.forEach(task => {
        if (task.statuses[date] !== undefined) {
          totalTasks++;
          const status = task.statuses[date] || "";
          if (status === "Done") completedCount++;
          else if (status === "Partial") partialCount += 0.5;
        }
      });
      
      return totalTasks > 0 ? Math.round(((completedCount + partialCount) / totalTasks) * 100) : 0;
    });
    
    setWeeklyTrend(trend);
    
    // Calculate streak
    let currentStreak = 0;
    // We reverse dates to start from today and go backwards
    const reversedDates = [...dates].reverse();
    
    for (const date of reversedDates) {
      let isComplete = false;
      let hasEntries = false;
      let completedRatio = 0;
      
      // Count completed tasks for this date
      let dateCompleted = 0;
      let datePartial = 0;
      let dateTotal = 0;
      
      tasks.forEach(task => {
        const status = task.statuses[date];
        if (status !== undefined) {
          hasEntries = true;
          dateTotal++;
          
          if (status === "Done") dateCompleted++;
          else if (status === "Partial") datePartial += 0.5;
        }
      });
      
      if (hasEntries) {
        completedRatio = (dateCompleted + datePartial) / dateTotal;
        // A day is complete if at least 70% of tasks are completed
        if (completedRatio >= 0.7) {
          isComplete = true;
          currentStreak++;
        } else {
          break;
        }
      } else {
        // Skip days with no entries (don't break streak)
        continue;
      }
    }
    
    setStreakCount(currentStreak);
  }, [tasks, dates]);

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
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Today's Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="bg-gradient-to-br from-todo-purple/30 to-todo-purple/10 border-none shadow-lg overflow-hidden relative">
            <div 
              className="absolute top-0 right-0 w-20 h-20 bg-purple-600 rounded-full -mt-10 -mr-10 opacity-20 blur-xl"
              aria-hidden="true"
            />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Completion</p>
                  <p className="text-2xl font-bold mt-1">{todayStats.completionRate}%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-todo-purple/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-todo-purple" />
                </div>
              </div>
              <Progress 
                value={todayStats.completionRate} 
                className="h-1.5 mt-3 bg-white/10" 
                indicatorClassName="bg-todo-purple" 
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-none shadow-lg overflow-hidden relative">
            <div 
              className="absolute top-0 right-0 w-20 h-20 bg-green-600 rounded-full -mt-10 -mr-10 opacity-20 blur-xl"
              aria-hidden="true"
            />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Completed</p>
                  <p className="text-2xl font-bold mt-1">{todayStats.completed}/{todayStats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
              </div>
              <Progress 
                value={todayStats.total ? (todayStats.completed / todayStats.total) * 100 : 0} 
                className="h-1.5 mt-3 bg-white/10" 
                indicatorClassName="bg-green-400" 
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-none shadow-lg overflow-hidden relative">
            <div 
              className="absolute top-0 right-0 w-20 h-20 bg-blue-600 rounded-full -mt-10 -mr-10 opacity-20 blur-xl"
              aria-hidden="true"
            />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Streak</p>
                  <p className="text-2xl font-bold mt-1">{streakCount} days</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-900/20 flex items-center justify-center">
                  <Award className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <Progress 
                value={Math.min(streakCount * 10, 100)} 
                className="h-1.5 mt-3 bg-white/10" 
                indicatorClassName="bg-blue-400" 
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 border-none shadow-lg overflow-hidden relative">
            <div 
              className="absolute top-0 right-0 w-20 h-20 bg-orange-600 rounded-full -mt-10 -mr-10 opacity-20 blur-xl"
              aria-hidden="true"
            />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Today</p>
                  <p className="text-2xl font-bold mt-1">{format(new Date(), 'E, MMM d')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-900/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-400" />
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {weeklyTrend.map((value, i) => (
                  <motion.div 
                    key={i}
                    className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden"
                    initial={{ opacity: 0.5, scaleY: 0.8 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <motion.div 
                      className="h-full bg-orange-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Weekly Trend */}
      <motion.div variants={itemVariants}>
        <Card className="border-white/5 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-todo-purple" />
              Weekly Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-end h-16 gap-2">
              {weeklyTrend.map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <motion.div 
                    className={cn(
                      "w-full rounded-t transition-all",
                      value >= 70 ? "bg-green-500" : 
                      value >= 40 ? "bg-yellow-500" : 
                      "bg-red-500"
                    )}
                    style={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                  <span className="text-xs mt-1 text-white/60">
                    {format(new Date(dates[i]), 'EEE')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Task Breakdown */}
      <motion.div variants={itemVariants}>
        <Card className="border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-todo-purple" />
              Today's Task Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <motion.div 
              className="grid grid-cols-2 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/70 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5" />
                    Completed
                  </span>
                  <span className="text-xs font-medium">{todayStats.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/70 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5" />
                    Partial
                  </span>
                  <span className="text-xs font-medium">{todayStats.partial}</span>
                </div>
              </motion.div>
              <motion.div className="space-y-2" variants={itemVariants}>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/70 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-400 mr-1.5" />
                    Not Done
                  </span>
                  <span className="text-xs font-medium">{todayStats.notDone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/70 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mr-1.5" />
                    Skipped
                  </span>
                  <span className="text-xs font-medium">{todayStats.skipped}</span>
                </div>
              </motion.div>
              <motion.div className="col-span-2 mt-2" variants={itemVariants}>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/70 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white/30 mr-1.5" />
                    Not Set
                  </span>
                  <span className="text-xs font-medium">{todayStats.notSet}</span>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
