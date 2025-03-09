
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TodoList } from "@/components/TodoList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskHistory } from "@/components/TaskHistory";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Journal } from "@/components/Journal";
import { Achievements } from "@/components/Achievements";

interface DashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Dashboard({ activeTab = "today", onTabChange }: DashboardProps) {
  const handleValueChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };
  
  return (
    <Tabs 
      defaultValue="today" 
      value={activeTab} 
      onValueChange={handleValueChange}
      className="w-full animate-fade-in"
    >
      <TabsContent value="today" className="focus-visible:outline-none">
        <TodoList />
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
      
      <TabsContent value="achievements" className="focus-visible:outline-none">
        <Achievements />
      </TabsContent>
    </Tabs>
  );
}
