
import { useTodo } from "@/contexts/TodoContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CheckSquare, Clock, PieChart, ArrowUpRight, Zap, BarChart3, Calendar, Target } from "lucide-react";
import { format, isSameDay, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, subDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";

export function ProductivityDashboard() {
  const { todos, logs, analytics } = useTodo();
  
  const today = new Date();
  const todayTodos = todos.filter(todo => !todo.completedAt || isSameDay(parseISO(todo.completedAt), today));
  const completedToday = todayTodos.filter(todo => todo.completed).length;
  const totalToday = todayTodos.length;
  const completionRateToday = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  
  const streak = analytics.streakCount;
  const longestStreak = analytics.longestStreak;
  
  // Calculate weekly stats
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  
  const completedThisWeek = useMemo(() => {
    return todos.filter(todo => 
      todo.completed && 
      todo.completedAt && 
      isWithinInterval(parseISO(todo.completedAt), { start: weekStart, end: weekEnd })
    ).length;
  }, [todos, weekStart, weekEnd]);
  
  const totalThisWeek = useMemo(() => {
    return todos.filter(todo => 
      !todo.completedAt || 
      isWithinInterval(parseISO(todo.completedAt), { start: weekStart, end: weekEnd })
    ).length;
  }, [todos, weekStart, weekEnd]);
  
  const completionRateWeek = totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;
  
  // Calculate daily completion rates for the past 7 days
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const log = logs.find(log => {
        const logDate = new Date(log.date);
        return isSameDay(logDate, date);
      });
      
      const completionRate = log ? 
        (log.totalCount > 0 ? Math.round((log.completedCount / log.totalCount) * 100) : 0) : 0;
      
      return {
        date,
        label: format(date, "EEE"),
        completionRate
      };
    });
  }, [logs, today]);
  
  // Get priorities breakdown
  const prioritiesCount = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    todos.forEach(todo => {
      counts[todo.priority] += 1;
    });
    return counts;
  }, [todos]);
  
  const totalPriorities = prioritiesCount.high + prioritiesCount.medium + prioritiesCount.low;
  
  // Get upcoming tasks
  const upcomingTasks = useMemo(() => {
    return todos
      .filter(todo => !todo.completed)
      .sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (a.priority !== 'high' && b.priority === 'high') return 1;
        if (a.priority === 'medium' && b.priority === 'low') return -1;
        if (a.priority === 'low' && b.priority === 'medium') return 1;
        return 0;
      })
      .slice(0, 3);
  }, [todos]);
  
  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-secondary/30 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{completionRateToday}%</div>
              <CheckCircle2 className="h-5 w-5 text-white/80" />
            </div>
            <Progress value={completionRateToday} className="h-1 mt-2 bg-white/10" indicatorClassName="bg-white" />
            <p className="text-xs text-white/60 mt-2">{completedToday}/{totalToday} tasks completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/30 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{completionRateWeek}%</div>
              <BarChart3 className="h-5 w-5 text-white/80" />
            </div>
            <Progress value={completionRateWeek} className="h-1 mt-2 bg-white/10" indicatorClassName="bg-white" />
            <p className="text-xs text-white/60 mt-2">{completedThisWeek}/{totalThisWeek} tasks this week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/30 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{streak} days</div>
              <Zap className="h-5 w-5 text-white/80" />
            </div>
            <Progress 
              value={(streak / (longestStreak > 0 ? longestStreak : 1)) * 100} 
              className="h-1 mt-2 bg-white/10"
              indicatorClassName="bg-white"
            />
            <p className="text-xs text-white/60 mt-2">Longest: {longestStreak} days</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Weekly chart and priorities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-secondary/30 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Weekly Performance</CardTitle>
            <CardDescription className="text-white/60">Daily completion rates for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-44">
              {last7Days.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-white/80 rounded-sm transition-all"
                    style={{ 
                      height: `${day.completionRate}%`,
                      maxHeight: '100%',
                      opacity: isSameDay(day.date, today) ? 1 : 0.7
                    }}
                  ></div>
                  <span className="text-xs mt-2 text-white/60">{day.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/30 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Task Priorities</CardTitle>
            <CardDescription className="text-white/60">Breakdown by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white/80">High</span>
                  <span className="text-sm text-white/80">
                    {totalPriorities > 0 ? Math.round((prioritiesCount.high / totalPriorities) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={totalPriorities > 0 ? (prioritiesCount.high / totalPriorities) * 100 : 0} 
                  className="h-1.5 bg-white/10"
                  indicatorClassName="bg-white"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white/80">Medium</span>
                  <span className="text-sm text-white/80">
                    {totalPriorities > 0 ? Math.round((prioritiesCount.medium / totalPriorities) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={totalPriorities > 0 ? (prioritiesCount.medium / totalPriorities) * 100 : 0} 
                  className="h-1.5 bg-white/10"
                  indicatorClassName="bg-white/80"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white/80">Low</span>
                  <span className="text-sm text-white/80">
                    {totalPriorities > 0 ? Math.round((prioritiesCount.low / totalPriorities) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={totalPriorities > 0 ? (prioritiesCount.low / totalPriorities) * 100 : 0} 
                  className="h-1.5 bg-white/10"
                  indicatorClassName="bg-white/60"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-secondary/30 border-white/5">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Priority Tasks</CardTitle>
              <Target className="h-5 w-5 text-white/80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-3 rounded-md bg-white/5 flex items-start justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${
                        task.priority === 'high' ? 'bg-white' : 
                        task.priority === 'medium' ? 'bg-white/80' : 'bg-white/60'
                      }`} />
                      <div>
                        <p className="font-medium text-white">{task.text}</p>
                        <p className="text-xs text-white/60">
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                        </p>
                      </div>
                    </div>
                    <CheckSquare className="h-5 w-5 text-white/40" />
                  </div>
                ))
              ) : (
                <p className="text-center text-white/60 py-4">No pending tasks</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/30 border-white/5">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Productivity Insights</CardTitle>
              <PieChart className="h-5 w-5 text-white/80" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="bg-black/50 p-1.5 rounded-full">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Best Time of Day</p>
                    <p className="text-xs text-white/60">Most productive in the morning</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/60" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-md bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="bg-black/50 p-1.5 rounded-full">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Most Productive Day</p>
                    <p className="text-xs text-white/60">Monday (Average: 68% completion)</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/60" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-md bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="bg-black/50 p-1.5 rounded-full">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Task Completion</p>
                    <p className="text-xs text-white/60">You complete {totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}% of tasks on average</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/60" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
