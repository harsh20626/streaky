
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TodoList } from "@/components/TodoList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskHistory } from "@/components/TaskHistory";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Journal } from "@/components/Journal";
import { DailyEssentialsTable } from "@/components/DailyEssentials/DailyEssentialsTable";
import { DailyEssentialsAnalytics } from "@/components/DailyEssentials/DailyEssentialsAnalytics";
import { useState, useEffect } from "react";
import { ProductivityDashboard } from "./ProductivityDashboard";

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
  
  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="dashboard" 
        value={activeTab} 
        onValueChange={handleValueChange}
        className="w-full animate-fade-in"
      >
        <TabsContent value="dashboard" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ProductivityDashboard />
            </div>
            <div>
              <DailyEssentialsAnalytics />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="today" className="focus-visible:outline-none">
          <TodoList />
        </TabsContent>
        
        <TabsContent value="essentials" className="focus-visible:outline-none">
          <DailyEssentialsTable />
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
