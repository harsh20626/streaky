
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TodoList } from "@/components/TodoList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskHistory } from "@/components/TaskHistory";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Journal } from "@/components/Journal";
import { Achievements } from "@/components/Achievements";
import { Motivation } from "@/components/Motivation";
import { DailyEssentialsTable } from "@/components/DailyEssentials/DailyEssentialsTable";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface DashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Dashboard({ activeTab = "today", onTabChange }: DashboardProps) {
  const { user } = useAuth();
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
      
      return `${greetText}, ${user?.name || 'there'}!`;
    };
    
    setGreeting(getTimeBasedGreeting());
    
    // Update greeting every hour
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 3600000);
    
    return () => clearInterval(interval);
  }, [user]);

  const handleValueChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };
  
  return (
    <div className="space-y-4">
      {user && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-purple-200">{greeting}</h2>
          <p className="text-sm text-purple-300/70">Welcome to your productivity dashboard</p>
        </div>
      )}
      
      <Tabs 
        defaultValue="today" 
        value={activeTab} 
        onValueChange={handleValueChange}
        className="w-full animate-fade-in"
      >
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
        
        <TabsContent value="motivation" className="focus-visible:outline-none">
          <Motivation />
        </TabsContent>
        
        <TabsContent value="analytics" className="focus-visible:outline-none">
          <TaskAnalytics />
        </TabsContent>
        
        <TabsContent value="history" className="focus-visible:outline-none">
          <TaskHistory />
        </TabsContent>
        
        <TabsContent value="achievements" className="focus-visible:outline-none">
          <Achievements />
        </TabsContent>
      </Tabs>
    </div>
  );
}
