
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { format } from "date-fns";
import { BookText, CheckCircle2, Menu, MoonStar, LayoutDashboard, Timer, History } from "lucide-react";
import { useTodo } from "@/contexts/TodoContext";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { todos } = useTodo();
  const [activeTab, setActiveTab] = useState("today");
  
  const completedToday = todos.filter(todo => todo.completed).length;
  
  // Update the time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formattedDate = format(currentTime, "EEEE, MMMM d, yyyy");
  const formattedTime = format(currentTime, "h:mm a");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <div className={cn("flex items-center gap-2", !sidebarOpen && "hidden")}>
            <BookText className="h-5 w-5 text-todo-purple" />
            <h1 className="text-lg font-bold text-gradient-primary">SoulScript</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 hover:bg-sidebar-accent"
          >
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleTabChange("today")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent",
                  activeTab === "today" && "bg-sidebar-accent"
                )}
              >
                <CheckCircle2 className="h-5 w-5 text-todo-purple" />
                {sidebarOpen && <span>Todo List</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("pomodoro")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent",
                  activeTab === "pomodoro" && "bg-sidebar-accent"
                )}
              >
                <Timer className="h-5 w-5 text-orange-500" />
                {sidebarOpen && <span>Focus Timer</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("journal")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent",
                  activeTab === "journal" && "bg-sidebar-accent"
                )}
              >
                <MoonStar className="h-5 w-5 text-yellow-500" />
                {sidebarOpen && <span>Journal</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("analytics")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent",
                  activeTab === "analytics" && "bg-sidebar-accent"
                )}
              >
                <LayoutDashboard className="h-5 w-5 text-blue-500" />
                {sidebarOpen && <span>Analytics</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("history")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent",
                  activeTab === "history" && "bg-sidebar-accent"
                )}
              >
                <History className="h-5 w-5 text-green-500" />
                {sidebarOpen && <span>History</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-16"
      )}>
        <header className="py-6 px-4 sm:px-6 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-todo-gray px-4 py-2 rounded-full mb-2">
            <CheckCircle2 className="h-5 w-5 text-todo-purple" />
            <h1 className="text-xl font-bold text-gradient-primary">Streaky</h1>
          </div>
          <div className="flex justify-center items-center mt-2 text-sm text-muted-foreground">
            <span>{formattedDate} • {formattedTime}</span>
          </div>
        </header>

        <main className="flex-1 container max-w-4xl px-4 sm:px-6 pb-20">
          <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
        </main>
      </div>
    </div>
  );
}
