
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TodoList } from "@/components/TodoList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskHistory } from "@/components/TaskHistory";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Journal } from "@/components/Journal";
import { DailyEssentialsTable } from "@/components/DailyEssentials/DailyEssentialsTable";
import { DailyEssentialsAnalytics } from "@/components/DailyEssentials/DailyEssentialsAnalytics";
import { DailyEssentialsDetailedAnalytics } from "@/components/DailyEssentials/DailyEssentialsDetailedAnalytics";
import { useState, useEffect } from "react";
import { ProductivityDashboard } from "./ProductivityDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Calendar, CheckSquare, PieChart } from "lucide-react";
import { motion } from "framer-motion";
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
              <Card className="bg-sidebar/30 border-white/5 overflow-hidden relative">
                <div 
                  className="absolute top-0 right-0 w-64 h-64 bg-sidebar rounded-full -mt-12 -mr-12 opacity-30 blur-3xl"
                  aria-hidden="true"
                />
                <CardContent className="pt-6 pb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-1">{greeting}</h1>
                  <p className="text-white/60">Here's an overview of your productivity and daily essentials.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Quick Actions Grid - Cleaner, more organized */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border-white/5 hover:bg-sidebar/30 transition-colors group">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">My Tasks</h3>
                    <p className="text-sm text-white/60">Manage your todo list</p>
                  </div>
                  <div className="h-12 w-12 rounded-md bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckSquare className="h-6 w-6 text-purple-300" />
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => onTabChange && onTabChange("today")}
                  >
                    View Tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-white/5 hover:bg-sidebar/30 transition-colors group">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Daily Essentials</h3>
                    <p className="text-sm text-white/60">Track your daily habits</p>
                  </div>
                  <div className="h-12 w-12 rounded-md bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6 text-blue-300" />
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => onTabChange && onTabChange("essentials")}
                  >
                    View Habits
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-white/5 hover:bg-sidebar/30 transition-colors group">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Task Analytics</h3>
                    <p className="text-sm text-white/60">See your task progress</p>
                  </div>
                  <div className="h-12 w-12 rounded-md bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 text-green-300" />
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => onTabChange && onTabChange("analytics")}
                  >
                    View Analytics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 border-white/5 hover:bg-sidebar/30 transition-colors group">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Habits Analytics</h3>
                    <p className="text-sm text-white/60">Track your habit progress</p>
                  </div>
                  <div className="h-12 w-12 rounded-md bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PieChart className="h-6 w-6 text-orange-300" />
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => onTabChange && onTabChange("essentials-analytics")}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
            
            {/* Main Dashboard Content - More minimal and focused */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <ProductivityDashboard />
              </motion.div>
              <motion.div variants={itemVariants}>
                <DailyEssentialsAnalytics />
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
