
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  Menu, 
  LayoutDashboard, 
  Timer, 
  History,
  LineChart,
  BarChart3,
  ListTodo,
  MoonStar,
  BookText,
  Calendar,
  PieChart
} from "lucide-react";
import { useTodo } from "@/contexts/TodoContext";
import { cn } from "@/lib/utils";
import { OnboardingGuide } from "@/components/OnboardingGuide";

export function AppLayout() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { todos } = useTodo();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const completedToday = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  const completionRate = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;
  
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
      {/* Onboarding Guide for new users */}
      <OnboardingGuide />
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 shadow-lg",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <div className={cn("flex items-center gap-2", !sidebarOpen && "hidden")}>
            <BookText className="h-5 w-5 text-white" />
            <h1 className="text-lg font-bold text-gradient-primary">Streaky</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 hover:bg-sidebar-accent transition-colors"
          >
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="px-2 py-4 h-[calc(100vh-80px)] flex flex-col justify-between overflow-y-auto scrollbar-transparent">
          <div>
            <div className="mb-4 px-3">
              <h2 className={cn("text-xs uppercase text-sidebar-foreground/50 font-medium mb-2", !sidebarOpen && "sr-only")}>
                Main
              </h2>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "dashboard" && "bg-white/10 text-white"
                    )}
                  >
                    <LayoutDashboard className={cn("h-5 w-5", !sidebarOpen && "mx-auto")} />
                    {sidebarOpen && <span>Dashboard</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("today")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "today" && "bg-white/10 text-white"
                    )}
                  >
                    <CheckCircle2 className={cn("h-5 w-5", !sidebarOpen && "mx-auto")} />
                    {sidebarOpen && <span>Todo List</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("essentials")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "essentials" && "bg-white/10 text-white"
                    )}
                  >
                    <ListTodo className={cn("h-5 w-5", !sidebarOpen && "mx-auto")} />
                    {sidebarOpen && <span>Daily Essentials</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("essentials-analytics")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "essentials-analytics" && "bg-white/10 text-white"
                    )}
                  >
                    <Calendar className={cn("h-5 w-5", !sidebarOpen && "mx-auto")} />
                    {sidebarOpen && <span>Essentials Analytics</span>}
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="mb-4 px-3">
              <h2 className={cn("text-xs uppercase text-sidebar-foreground/50 font-medium mb-2", !sidebarOpen && "sr-only")}>
                Tools
              </h2>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleTabChange("analytics")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "analytics" && "bg-white/10 text-white"
                    )}
                  >
                    <LineChart className={cn("h-5 w-5", !sidebarOpen && "mx-auto")} />
                    {sidebarOpen && <span>Task Analytics</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("pomodoro")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "pomodoro" && "bg-white/10 text-white"
                    )}
                  >
                    <Timer className={cn("h-5 w-5", !sidebarOpen && "mx-auto")} />
                    {sidebarOpen && <span>Focus Timer</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("journal")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "journal" && "bg-white/10 text-white"
                    )}
                  >
                    <MoonStar className={cn("h-5 w-5", !sidebarOpen && "mx-auto")} />
                    {sidebarOpen && <span>Journal</span>}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("history")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "history" && "bg-white/10 text-white"
                    )}
                  >
                    <History className={cn("h-5 w-5", !sidebarOpen && "mx-auto")} />
                    {sidebarOpen && <span>History</span>}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-auto px-3">
            {sidebarOpen && (
              <div className="py-2 px-3 bg-white/5 rounded-md text-xs text-white/70">
                <div className="flex justify-between mb-1">
                  <span>Today's Progress</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div 
                    className="bg-white h-1.5 rounded-full" 
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300 bg-todo-dark",
        sidebarOpen ? "ml-64" : "ml-16"
      )}>
        <header className="py-6 px-4 sm:px-6 md:px-8 border-b border-white/5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "today" && "Todo List"}
                {activeTab === "essentials" && "Daily Essentials"}
                {activeTab === "essentials-analytics" && "Essentials Analytics"}
                {activeTab === "analytics" && "Task Analytics"}
                {activeTab === "pomodoro" && "Focus Timer"}
                {activeTab === "journal" && "Journal"}
                {activeTab === "history" && "History"}
              </h1>
              <p className="text-sm text-white/60">{formattedDate} • {formattedTime}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-sm font-medium text-white">{completedToday}/{totalTasks} tasks</p>
                <p className="text-xs text-white/60">Today's progress</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 container max-w-6xl px-4 sm:px-6 py-6 overflow-y-auto scrollbar-transparent">
          <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
        </main>
      </div>
    </div>
  );
}
