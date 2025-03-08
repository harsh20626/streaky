
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";

export function AppLayout() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formattedDate = format(currentTime, "EEEE, MMMM d, yyyy");
  const formattedTime = format(currentTime, "h:mm a");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 sm:px-6 md:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-todo-gray px-4 py-2 rounded-full mb-2">
          <CheckCircle2 className="h-5 w-5 text-todo-purple" />
          <h1 className="text-xl font-bold text-gradient-primary">Streaky</h1>
        </div>
        <div className="flex justify-center items-center mt-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>{formattedDate} • {formattedTime}</span>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl px-4 sm:px-6 pb-20">
        <Dashboard />
      </main>
    </div>
  );
}
