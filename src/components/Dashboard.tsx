
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoList } from "@/components/TodoList";
import { TaskAnalytics } from "@/components/TaskAnalytics";
import { TaskHistory } from "@/components/TaskHistory";
import { LayoutDashboard, ListTodo, History } from "lucide-react";

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
      
      <TabsContent value="analytics" className="focus-visible:outline-none">
        <TaskAnalytics />
      </TabsContent>
      
      <TabsContent value="history" className="focus-visible:outline-none">
        <TaskHistory />
      </TabsContent>
    </Tabs>
  );
}
