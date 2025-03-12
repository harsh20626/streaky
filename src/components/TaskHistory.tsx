
import { useTodo } from "@/contexts/TodoContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Clock, X, BarChart3, ArrowUpRight, ArrowDown, ArrowUp } from "lucide-react";
import { format, parseISO, isSameDay, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { DailyLog, Todo } from "@/types/todo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";

export function TaskHistory() {
  const { logs } = useTodo();

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (sortedLogs.length === 0) return null;
    
    // Overall completion rate
    let totalTasks = 0;
    let totalCompleted = 0;
    
    // Calculate completion by time periods
    const todayLog = sortedLogs.find(log => isToday(new Date(log.date)));
    const yesterdayLog = sortedLogs.find(log => isYesterday(new Date(log.date)));
    
    // Tasks by week and month
    let thisWeekTasks = 0;
    let thisWeekCompleted = 0;
    let thisMonthTasks = 0;
    let thisMonthCompleted = 0;
    
    sortedLogs.forEach(log => {
      const logDate = new Date(log.date);
      
      // Add to totals
      totalTasks += log.totalCount;
      totalCompleted += log.completedCount;
      
      // Weekly
      if (isThisWeek(logDate)) {
        thisWeekTasks += log.totalCount;
        thisWeekCompleted += log.completedCount;
      }
      
      // Monthly
      if (isThisMonth(logDate)) {
        thisMonthTasks += log.totalCount;
        thisMonthCompleted += log.completedCount;
      }
    });
    
    const lastTwoLogs = sortedLogs.slice(0, 2);
    const trend = lastTwoLogs.length === 2 ? 
      (lastTwoLogs[0].completedCount / lastTwoLogs[0].totalCount) - 
      (lastTwoLogs[1].completedCount / lastTwoLogs[1].totalCount) : 0;
    
    return {
      overallCompletionRate: totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0,
      weeklyCompletionRate: thisWeekTasks > 0 ? Math.round((thisWeekCompleted / thisWeekTasks) * 100) : 0,
      monthlyCompletionRate: thisMonthTasks > 0 ? Math.round((thisMonthCompleted / thisMonthTasks) * 100) : 0,
      todayCompletionRate: todayLog && todayLog.totalCount > 0 ? 
        Math.round((todayLog.completedCount / todayLog.totalCount) * 100) : 0,
      yesterdayCompletionRate: yesterdayLog && yesterdayLog.totalCount > 0 ? 
        Math.round((yesterdayLog.completedCount / yesterdayLog.totalCount) * 100) : 0,
      trend: trend,
      trendDirection: trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral'
    };
  }, [sortedLogs]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-secondary/30 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Today vs Yesterday</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.todayCompletionRate}%</p>
                  <p className="text-xs text-white/60">Today's completion</p>
                </div>
                
                <div className="flex items-center">
                  {stats.trendDirection === 'up' ? (
                    <div className="flex items-center rounded-full bg-white/10 px-2 py-1">
                      <ArrowUp className="h-3 w-3 text-white mr-1" />
                      <span className="text-xs text-white">
                        {Math.abs(Math.round(stats.trend * 100))}%
                      </span>
                    </div>
                  ) : stats.trendDirection === 'down' ? (
                    <div className="flex items-center rounded-full bg-white/10 px-2 py-1">
                      <ArrowDown className="h-3 w-3 text-white mr-1" />
                      <span className="text-xs text-white">
                        {Math.abs(Math.round(stats.trend * 100))}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center rounded-full bg-white/10 px-2 py-1">
                      <span className="text-xs text-white">No change</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/60">Today</span>
                    <span className="text-xs text-white/60">{stats.todayCompletionRate}%</span>
                  </div>
                  <Progress value={stats.todayCompletionRate} className="h-1 bg-white/10" indicatorClassName="bg-white" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/60">Yesterday</span>
                    <span className="text-xs text-white/60">{stats.yesterdayCompletionRate}%</span>
                  </div>
                  <Progress value={stats.yesterdayCompletionRate} className="h-1 bg-white/10" indicatorClassName="bg-white/60" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/30 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Time Period Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-white/80">This week</p>
                    <p className="text-sm font-medium text-white">{stats.weeklyCompletionRate}%</p>
                  </div>
                  <Progress value={stats.weeklyCompletionRate} className="h-1 mt-1 bg-white/10" indicatorClassName="bg-white" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-white/80">This month</p>
                    <p className="text-sm font-medium text-white">{stats.monthlyCompletionRate}%</p>
                  </div>
                  <Progress value={stats.monthlyCompletionRate} className="h-1 mt-1 bg-white/10" indicatorClassName="bg-white" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-white/80">All time</p>
                    <p className="text-sm font-medium text-white">{stats.overallCompletionRate}%</p>
                  </div>
                  <Progress value={stats.overallCompletionRate} className="h-1 mt-1 bg-white/10" indicatorClassName="bg-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/30 border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Productivity Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-white">{stats.overallCompletionRate}</span>
                </div>
                <p className="text-sm text-white/80">Overall Productivity</p>
                <p className="text-xs text-white/60 mt-1">Based on task completion rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
  
      {sortedLogs.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No history yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Complete your first day to see history
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {sortedLogs.map((log) => (
            <LogItem key={log.date} log={log} />
          ))}
        </Accordion>
      )}
    </div>
  );
}

function LogItem({ log }: { log: DailyLog }) {
  const formattedDate = format(new Date(log.date), "EEEE, MMMM d, yyyy");
  const completionRate = log.totalCount > 0 
    ? Math.round((log.completedCount / log.totalCount) * 100) 
    : 0;

  return (
    <AccordionItem 
      value={log.date} 
      className="bg-secondary/30 border border-white/10 rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
        <div className="flex flex-1 items-center justify-between">
          <span className="font-medium text-white">{formattedDate}</span>
          <div className="flex items-center gap-4 mr-4">
            <span className="text-sm flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-white" />
              {completionRate}%
            </span>
            <span className="text-sm text-white/60">
              {log.completedCount}/{log.totalCount} tasks
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3">
        <div className="space-y-2 mt-2 max-h-60 overflow-y-auto scrollbar-transparent">
          {log.todos.map((todo: Todo) => (
            <HistoryTodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function HistoryTodoItem({ todo }: { todo: Todo }) {
  const priorityColor = {
    low: "text-white/60",
    medium: "text-white/80",
    high: "text-white"
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-2 rounded-md", 
      todo.completed ? "bg-white/10" : "bg-secondary/50"
    )}>
      {todo.completed ? (
        <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-white/60 flex-shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate", 
          todo.completed ? "text-white" : "text-white/60"
        )}>
          {todo.text}
        </p>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs", priorityColor[todo.priority])}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
          
          {todo.completedAt && (
            <span className="text-xs text-white/40 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {format(parseISO(todo.completedAt), "HH:mm")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
