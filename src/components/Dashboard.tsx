
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoList } from "@/components/TodoList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskHistory } from "@/components/TaskHistory";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Journal } from "@/components/Journal";
import { LayoutDashboard, ListTodo, History, Timer, BookText } from "lucide-react";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("today");
  
  return (
    <Tabs 
      defaultValue="today" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full animate-fade-in"
    >
      <div className="flex justify-center mb-6">
        <TabsList className="bg-todo-gray">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            <span className="hidden sm:inline">Today</span>
          </TabsTrigger>
          <TabsTrigger value="pomodoro" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="hidden sm:inline">Focus</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            <span className="hidden sm:inline">Journal</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
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
    </Tabs>
  );
}
