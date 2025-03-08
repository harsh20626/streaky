
import { useTodo } from "@/contexts/TodoContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Activity, CheckCircle, Flame, ListChecks, Star } from "lucide-react";
import { format, subDays } from "date-fns";

export function TaskAnalytics() {
  const { todos, analytics, logs } = useTodo();
  
  // Calculate today's stats
  const completedToday = todos.filter(todo => todo.completed).length;
  const totalToday = todos.length;
  const completionRateToday = totalToday > 0 
    ? Math.round((completedToday / totalToday) * 100) 
    : 0;
  
  // Format completion rate data for the chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, "yyyy-MM-dd");
    const logForDate = logs.find(log => log.date === formattedDate);
    
    return {
      date: format(date, "MM/dd"),
      rate: logForDate 
        ? Math.round((logForDate.completedCount / (logForDate.totalCount || 1)) * 100) 
        : 0
    };
  }).reverse();
  
  // Create data for priority distribution
  const priorityCounts = {
    low: todos.filter(todo => todo.priority === "low").length,
    medium: todos.filter(todo => todo.priority === "medium").length,
    high: todos.filter(todo => todo.priority === "high").length
  };
  
  const priorityData = [
    { name: "Low", value: priorityCounts.low },
    { name: "Medium", value: priorityCounts.medium },
    { name: "High", value: priorityCounts.high }
  ].filter(item => item.value > 0);
  
  const PRIORITY_COLORS = ["#4dabf7", "#ffd43b", "#fa5252"];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.streakCount} days</div>
            <p className="text-xs text-muted-foreground">
              Longest: {analytics.longestStreak} days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Flame className="h-4 w-4 mr-2 text-orange-500" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}/{totalToday}</div>
            <p className="text-xs text-muted-foreground">
              {completionRateToday}% completion rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Most Productive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.length > 0 
                ? format(new Date(logs[0].date), "EEE")
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your history
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ListChecks className="h-4 w-4 mr-2 text-blue-500" />
              Total Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.reduce((sum, log) => sum + log.completedCount, 0) + completedToday}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2 text-todo-purple" />
              Completion Rates
            </CardTitle>
            <CardDescription>Your task completion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={last7Days}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="date"
                    tick={{ fill: "#888" }}
                    axisLine={{ stroke: "#444" }}
                  />
                  <YAxis 
                    tick={{ fill: "#888" }}
                    axisLine={{ stroke: "#444" }}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Completion Rate"]}
                    contentStyle={{ 
                      backgroundColor: "#1e1e1e", 
                      borderColor: "#333",
                      color: "#fff" 
                    }}
                  />
                  <Bar 
                    dataKey="rate" 
                    fill="#9b87f5" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Star className="h-5 w-5 mr-2 text-todo-purple" />
              Frequent Tasks
            </CardTitle>
            <CardDescription>Your most common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.frequentTasks.length > 0 ? (
                analytics.frequentTasks.slice(0, 5).map((task, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-[180px]">{task.text}</span>
                    <span className="text-xs text-muted-foreground">
                      {task.count} {task.count === 1 ? "time" : "times"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Complete tasks to see trends
                </p>
              )}
            </div>
            
            {todos.length > 0 && (
              <div className="mt-6 h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name }) => name}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} tasks`, "Count"]}
                      contentStyle={{ 
                        backgroundColor: "#1e1e1e", 
                        borderColor: "#333",
                        color: "#fff" 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
