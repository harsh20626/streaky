
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
  ListTodo,
  MoonStar,
  BookText,
  Calendar,
  PieChart
} from "lucide-react";
import { useTodo } from "@/contexts/TodoContext";
import { cn } from "@/lib/utils";
import { OnboardingGuide } from "@/components/OnboardingGuide";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants for sidebar elements
  const sidebarItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: sidebarOpen ? 0 : 1, x: sidebarOpen ? -20 : 0 }
  };

  return (
    <div className="min-h-screen flex">
      {/* Onboarding Guide for new users */}
      <OnboardingGuide />
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: sidebarOpen ? "16rem" : "4rem" }}
        animate={{ width: sidebarOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border shadow-lg"
      >
        <motion.div className="p-4 flex items-center justify-between">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <BookText className="h-5 w-5 text-white" />
                <h1 className="text-lg font-bold text-gradient-primary">Streaky</h1>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 hover:bg-sidebar-accent transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          </motion.button>
        </motion.div>

        <nav className="px-2 py-4 h-[calc(100vh-80px)] flex flex-col justify-between overflow-y-auto scrollbar-transparent">
          <div>
            <div className="mb-4 px-3">
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.h2 
                    className="text-xs uppercase text-sidebar-foreground/50 font-medium mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Main
                  </motion.h2>
                )}
              </AnimatePresence>
              <ul className="space-y-1">
                <li>
                  <motion.button
                    onClick={() => handleTabChange("dashboard")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "dashboard" && "bg-white/10 text-white"
                    )}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <LayoutDashboard className="h-5 w-5 text-white" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Dashboard
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => handleTabChange("today")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "today" && "bg-white/10 text-white"
                    )}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Todo List
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => handleTabChange("essentials")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "essentials" && "bg-white/10 text-white"
                    )}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ListTodo className="h-5 w-5 text-white" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Daily Essentials
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => handleTabChange("essentials-analytics")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "essentials-analytics" && "bg-white/10 text-white"
                    )}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Calendar className="h-5 w-5 text-white" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Essentials Analytics
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
              </ul>
            </div>
            
            <div className="mb-4 px-3">
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.h2 
                    className="text-xs uppercase text-sidebar-foreground/50 font-medium mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Tools
                  </motion.h2>
                )}
              </AnimatePresence>
              <ul className="space-y-1">
                <li>
                  <motion.button
                    onClick={() => handleTabChange("analytics")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "analytics" && "bg-white/10 text-white"
                    )}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <LineChart className="h-5 w-5 text-white" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Task Analytics
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => handleTabChange("pomodoro")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "pomodoro" && "bg-white/10 text-white"
                    )}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Timer className="h-5 w-5 text-white" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Focus Timer
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => handleTabChange("journal")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "journal" && "bg-white/10 text-white"
                    )}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MoonStar className="h-5 w-5 text-white" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Journal
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => handleTabChange("history")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      activeTab === "history" && "bg-white/10 text-white"
                    )}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <History className="h-5 w-5 text-white" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          History
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
              </ul>
            </div>
          </div>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                className="mt-auto px-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="py-2 px-3 bg-white/5 rounded-md text-xs text-white/70">
                  <div className="flex justify-between mb-1">
                    <span>Today's Progress</span>
                    <span>{completionRate}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div 
                      className="bg-white h-1.5 rounded-full transition-all duration-1000 ease-in-out" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.aside>

      {/* Main content */}
      <motion.div 
        className={cn(
          "flex-1 bg-todo-dark",
        )}
        initial={{ marginLeft: sidebarOpen ? "16rem" : "4rem" }}
        animate={{ marginLeft: sidebarOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.header 
          className="py-6 px-4 sm:px-6 md:px-8 border-b border-white/5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <motion.h1 
                className="text-xl font-bold text-white"
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "today" && "Todo List"}
                {activeTab === "essentials" && "Daily Essentials"}
                {activeTab === "essentials-analytics" && "Essentials Analytics"}
                {activeTab === "analytics" && "Task Analytics"}
                {activeTab === "pomodoro" && "Focus Timer"}
                {activeTab === "journal" && "Journal"}
                {activeTab === "history" && "History"}
              </motion.h1>
              <p className="text-sm text-white/60">{formattedDate} • {formattedTime}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-sm font-medium text-white">{completedToday}/{totalTasks} tasks</p>
                <p className="text-xs text-white/60">Today's progress</p>
              </div>
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.9 }}
              >
                <PieChart className="h-5 w-5 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.header>

        <main className="flex-1 container max-w-6xl px-4 sm:px-6 py-6 overflow-y-auto scrollbar-transparent">
          <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
        </main>
      </motion.div>
    </div>
  );
}
