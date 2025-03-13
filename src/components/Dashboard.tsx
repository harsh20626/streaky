
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TodoList } from "@/components/TodoList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskHistory } from "@/components/TaskHistory";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Journal } from "@/components/Journal";
import { DailyEssentialsTable } from "@/components/DailyEssentials/DailyEssentialsTable";
import { DailyEssentialsAnalytics } from "@/components/DailyEssentials/DailyEssentialsAnalytics";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  Flame, 
  Clock, 
  FileText, 
  BarChart3, 
  ListTodo,
  Award
} from "lucide-react";
import { useTodo } from "@/contexts/TodoContext";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingGuide } from "@/components/OnboardingGuide";

interface DashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Dashboard({ activeTab = "dashboard", onTabChange }: DashboardProps) {
  const [greeting, setGreeting] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { todos, analytics } = useTodo();
  
  // Check if it's the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);
  
  // Set greeting based on time of day
  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      let greetText = "";
      
      if (hour < 12) {
        greetText = "Good morning";
      } else if (hour < 18) {
        greetText = "Good afternoon";
      } else {
        greetText = "Good evening";
      }
      
      return `${greetText}!`;
    };
    
    setGreeting(getTimeBasedGreeting());
    
    // Update greeting every hour
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  const handleValueChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };
  
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };
  
  // Get real data for dashboard
  const completedToday = todos.filter(todo => todo.completed).length;
  const pendingToday = todos.filter(todo => !todo.completed).length;
  
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
        duration: 0.4
      }
    }
  };
  
  return (
    <div className="space-y-4">
      {showOnboarding && <OnboardingGuide onClose={handleCloseOnboarding} />}
      
      <Tabs 
        defaultValue="dashboard" 
        value={activeTab} 
        onValueChange={handleValueChange}
        className="w-full animate-fade-in"
      >
        <TabsContent value="dashboard" className="focus-visible:outline-none">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Welcome Card */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden"
            >
              <Card className="bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-pink-900/30 border-white/5 overflow-hidden">
                <div 
                  className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mt-20 -mr-20 opacity-30 blur-3xl"
                  aria-hidden="true"
                />
                <div 
                  className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full -mb-20 -ml-20 opacity-30 blur-3xl"
                  aria-hidden="true"
                />
                <CardContent className="pt-8 pb-8">
                  <motion.h1 
                    className="text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent mb-2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {greeting}
                  </motion.h1>
                  <motion.p 
                    className="text-white/70 max-w-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Track your habits and tasks with Streaky. Focus on consistency to build lasting growth.
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Grid of Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1 - Daily Tasks */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="col-span-1"
              >
                <Card className="bg-gradient-to-br from-cyan-900/40 to-cyan-600/20 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-cyan-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-400/30 to-cyan-600/30 flex items-center justify-center">
                        <ListTodo className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">Daily Tasks</h3>
                        <p className="text-white/60 text-sm">Plan and track your daily tasks</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{completedToday}</p>
                          <p className="text-xs text-white/60">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{pendingToday}</p>
                          <p className="text-xs text-white/60">Pending</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-500/80 to-cyan-700/80 hover:from-cyan-500/90 hover:to-cyan-700/90 text-white shadow-lg"
                      onClick={() => onTabChange && onTabChange("today")}
                    >
                      View Tasks
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 2 - Daily Essentials */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="col-span-1"
              >
                <Card className="bg-gradient-to-br from-purple-900/40 to-purple-600/20 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-purple-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400/30 to-purple-600/30 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">Daily Essentials</h3>
                        <p className="text-white/60 text-sm">Track your recurring habits</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">70%</p>
                          <p className="text-xs text-white/60">Completion</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">5</p>
                          <p className="text-xs text-white/60">Habits</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500/80 to-purple-700/80 hover:from-purple-500/90 hover:to-purple-700/90 text-white shadow-lg"
                      onClick={() => onTabChange && onTabChange("essentials")}
                    >
                      View Habits
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 3 - Focus Timer */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="col-span-1"
              >
                <Card className="bg-gradient-to-br from-red-900/40 to-red-600/20 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-red-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-400/30 to-red-600/30 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">Focus Timer</h3>
                        <p className="text-white/60 text-sm">Boost productivity with Pomodoro</p>
                      </div>
                    </div>
                    
                    <div className="mb-4 text-center">
                      <p className="text-2xl font-bold text-white">25:00</p>
                      <p className="text-xs text-white/60">Start a new session</p>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-red-500/80 to-red-700/80 hover:from-red-500/90 hover:to-red-700/90 text-white shadow-lg"
                      onClick={() => onTabChange && onTabChange("pomodoro")}
                    >
                      Start Timer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Second Row - More Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 4 - Current Streak */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="col-span-1"
              >
                <Card className="bg-gradient-to-br from-amber-900/40 to-amber-600/20 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-amber-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-400/30 to-amber-600/30 flex items-center justify-center">
                        <Flame className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{analytics.streakCount} days</p>
                        <p className="text-white/60 text-sm">Current streak</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 5 - Longest Streak */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="col-span-1"
              >
                <Card className="bg-gradient-to-br from-green-900/40 to-green-600/20 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-green-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400/30 to-green-600/30 flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{analytics.longestStreak} days</p>
                        <p className="text-white/60 text-sm">Longest streak</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 6 - Analytics */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="col-span-1"
              >
                <Card className="bg-gradient-to-br from-blue-900/40 to-blue-600/20 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-blue-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400/30 to-blue-600/30 flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white">Task Analytics</p>
                        <p className="text-white/60 text-sm">View your progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 7 - Journal */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="col-span-1"
              >
                <Card className="bg-gradient-to-br from-pink-900/40 to-pink-600/20 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-pink-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400/30 to-pink-600/30 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-pink-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white">Journal</p>
                        <p className="text-white/60 text-sm">Reflect on your day</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Third Row - Quick Access */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-white/5">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-between">
                    <Button
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      onClick={() => onTabChange && onTabChange("today")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Tasks
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      onClick={() => onTabChange && onTabChange("essentials")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Habits
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      onClick={() => onTabChange && onTabChange("pomodoro")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Focus
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      onClick={() => onTabChange && onTabChange("analytics")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                      onClick={() => onTabChange && onTabChange("journal")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Journal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="today" className="focus-visible:outline-none">
          <TodoList />
        </TabsContent>
        
        <TabsContent value="essentials" className="focus-visible:outline-none">
          <DailyEssentialsTable />
        </TabsContent>
        
        <TabsContent value="essentials-analytics" className="focus-visible:outline-none">
          <DailyEssentialsAnalytics />
        </TabsContent>
        
        <TabsContent value="pomodoro" className="focus-visible:outline-none">
          <div className="max-w-md mx-auto">
            <PomodoroTimer />
          </div>
        </TabsContent>
        
        <TabsContent value="journal" className="focus-visible:outline-none">
          <Journal />
        </TabsContent>
        
        <TabsContent value="analytics" className="focus-visible:outline-none">
          <TaskAnalytics />
        </TabsContent>
        
        <TabsContent value="history" className="focus-visible:outline-none">
          <TaskHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
