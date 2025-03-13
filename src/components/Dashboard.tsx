import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TodoList } from "@/components/TodoList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskHistory } from "@/components/TaskHistory";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Journal } from "@/components/Journal";
import { DailyEssentialsTable } from "@/components/DailyEssentials/DailyEssentialsTable";
import { DailyEssentialsAnalytics } from "@/components/DailyEssentials/DailyEssentialsAnalytics";
import { DailyEssentialsDetailedAnalytics } from "@/components/DailyEssentials/DailyEssentialsDetailedAnalytics";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, CheckSquare, PieChart, Calendar, Award, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Dashboard({ activeTab = "dashboard", onTabChange }: DashboardProps) {
  const [greeting, setGreeting] = useState("");
  
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
    <div className="space-y-4">
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
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border-white/5 overflow-hidden relative">
                <div 
                  className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full -mt-20 -mr-20 opacity-30 blur-3xl"
                  aria-hidden="true"
                />
                <CardContent className="pt-8 pb-8">
                  <h1 className="text-4xl font-bold text-gradient-primary mb-2">{greeting}</h1>
                  <p className="text-white/70 max-w-lg">Here's a quick overview of your productivity. Access detailed analytics using the cards below.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Grid of Colorful Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 - Tasks */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-indigo-900/40 to-indigo-600/10 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-indigo-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white/90 text-lg">Tasks</CardTitle>
                      <CheckSquare className="h-5 w-5 text-indigo-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <p className="text-3xl font-bold text-white mb-1">5</p>
                        <p className="text-white/60 text-sm">pending tasks</p>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-indigo-600/40 hover:bg-indigo-600/60 text-white border-none"
                        onClick={() => onTabChange && onTabChange("today")}
                      >
                        View Tasks
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 2 - Essentials */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-cyan-900/40 to-cyan-600/10 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-cyan-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white/90 text-lg">Daily Habits</CardTitle>
                      <Calendar className="h-5 w-5 text-cyan-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <p className="text-3xl font-bold text-white mb-1">70%</p>
                        <p className="text-white/60 text-sm">completion rate</p>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-cyan-600/40 hover:bg-cyan-600/60 text-white border-none"
                        onClick={() => onTabChange && onTabChange("essentials")}
                      >
                        View Habits
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 3 - Task Analytics */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-pink-900/40 to-pink-600/10 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-pink-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white/90 text-lg">Task Analytics</CardTitle>
                      <BarChart3 className="h-5 w-5 text-pink-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <p className="text-3xl font-bold text-white mb-1">85%</p>
                        <p className="text-white/60 text-sm">weekly progress</p>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-pink-600/40 hover:bg-pink-600/60 text-white border-none"
                        onClick={() => onTabChange && onTabChange("analytics")}
                      >
                        View Analytics
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 4 - Habit Analytics */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-amber-900/40 to-amber-600/10 border-white/10 h-full shadow-lg overflow-hidden relative hover:bg-amber-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full -mt-12 -mr-12 opacity-30 blur-2xl" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white/90 text-lg">Habit Analytics</CardTitle>
                      <PieChart className="h-5 w-5 text-amber-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <p className="text-3xl font-bold text-white mb-1">76%</p>
                        <p className="text-white/60 text-sm">habit consistency</p>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-amber-600/40 hover:bg-amber-600/60 text-white border-none"
                        onClick={() => onTabChange && onTabChange("essentials-analytics")}
                      >
                        View Analytics
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Second Row - 2 Wider Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 5 - Streak */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-green-900/40 to-teal-700/10 border-white/10 shadow-lg overflow-hidden relative hover:bg-green-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full -mt-20 -mr-20 opacity-20 blur-2xl" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white/90 text-lg">Productivity Streak</CardTitle>
                      <Zap className="h-5 w-5 text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="bg-green-500/20 h-16 w-16 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">5</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">5-Day Streak</p>
                        <p className="text-white/60 text-sm">Keep it going! Your longest streak was 12 days.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Card 6 - Pomodoro */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-rose-900/40 to-red-700/10 border-white/10 shadow-lg overflow-hidden relative hover:bg-rose-900/30 transition-colors">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/20 rounded-full -mt-20 -mr-20 opacity-20 blur-2xl" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white/90 text-lg">Focus Time</CardTitle>
                      <Clock className="h-5 w-5 text-rose-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="bg-rose-500/20 h-16 w-16 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">2h</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">2 Hours Today</p>
                        <p className="text-white/60 text-sm">Start a Pomodoro session to increase focus time.</p>
                        <Button 
                          className="mt-2 bg-rose-600/40 hover:bg-rose-600/60 text-white border-none"
                          size="sm"
                          onClick={() => onTabChange && onTabChange("pomodoro")}
                        >
                          Start Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="today" className="focus-visible:outline-none">
          <TodoList />
        </TabsContent>
        
        <TabsContent value="essentials" className="focus-visible:outline-none">
          <DailyEssentialsTable />
        </TabsContent>
        
        <TabsContent value="essentials-analytics" className="focus-visible:outline-none">
          <DailyEssentialsDetailedAnalytics />
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
