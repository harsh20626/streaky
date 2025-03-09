
import { Analytics, DailyLog, Todo } from "@/types/todo";

// Get today's date in YYYY-MM-DD format
export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Check if we need to reset todos (new day)
export const shouldResetTodos = (lastUpdated: string | null): boolean => {
  if (!lastUpdated) return false;
  return lastUpdated !== getToday();
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Save todos to localStorage
export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem('todos', JSON.stringify(todos));
  localStorage.setItem('lastUpdated', getToday());
};

// Get todos from localStorage
export const getTodos = (): Todo[] => {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
};

// Get last updated date
export const getLastUpdated = (): string | null => {
  return localStorage.getItem('lastUpdated');
};

// Save daily log to history
export const saveDailyLog = (todos: Todo[]): void => {
  const logs = getDailyLogs();
  const completedCount = todos.filter(todo => todo.completed).length;
  
  const todayLog: DailyLog = {
    date: getToday(),
    todos: [...todos],
    completedCount,
    totalCount: todos.length
  };

  // Don't duplicate logs for the same day
  const filteredLogs = logs.filter(log => log.date !== getToday());
  
  localStorage.setItem('todoLogs', JSON.stringify([todayLog, ...filteredLogs]));
  
  // Update analytics after saving log
  updateAnalytics(todos);
};

// Get daily logs history
export const getDailyLogs = (): DailyLog[] => {
  const logs = localStorage.getItem('todoLogs');
  return logs ? JSON.parse(logs) : [];
};

// Update analytics based on todos and history
export const updateAnalytics = (todos: Todo[]): void => {
  const logs = getDailyLogs();
  const analytics = getAnalytics();
  
  // Calculate streak
  let currentStreak = 0;
  let streakBroken = false;
  
  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate current streak
  for (let i = 0; i < sortedLogs.length; i++) {
    const log = sortedLogs[i];
    const prevDate = i === 0 ? getToday() : sortedLogs[i-1].date;
    
    // Check if this date is consecutive to the previous one
    const currDate = new Date(log.date);
    const expectedDate = new Date(prevDate);
    expectedDate.setDate(expectedDate.getDate() - 1);
    
    if (log.completedCount > 0 && 
        currDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
      currentStreak++;
    } else {
      streakBroken = true;
      break;
    }
  }
  
  // Check today's completion for streak
  const todayCompleted = todos.some(todo => todo.completed);
  if (todayCompleted && !streakBroken) {
    currentStreak++;
  }
  
  // Calculate completion rates (last 7 days)
  const completionRates = sortedLogs.slice(0, 7).map(log => ({
    date: log.date,
    rate: log.totalCount > 0 ? (log.completedCount / log.totalCount) * 100 : 0
  }));
  
  // Calculate frequent tasks
  const taskMap = new Map<string, number>();
  
  // Count task occurrences from history
  sortedLogs.forEach(log => {
    log.todos.forEach(todo => {
      const taskText = todo.text.toLowerCase().trim();
      taskMap.set(taskText, (taskMap.get(taskText) || 0) + 1);
    });
  });
  
  // Convert map to array and sort by frequency
  const frequentTasks = Array.from(taskMap.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Update analytics
  const updatedAnalytics: Analytics = {
    streakCount: currentStreak,
    longestStreak: Math.max(analytics.longestStreak || 0, currentStreak),
    completionRates,
    frequentTasks
  };
  
  localStorage.setItem('todoAnalytics', JSON.stringify(updatedAnalytics));
};

// Get analytics data
export const getAnalytics = (): Analytics => {
  const analytics = localStorage.getItem('todoAnalytics');
  return analytics ? JSON.parse(analytics) : {
    streakCount: 0,
    longestStreak: 0,
    completionRates: [],
    frequentTasks: []
  };
};

// Reset todos for a new day but save history first
export const resetTodosForNewDay = (): Todo[] => {
  const currentTodos = getTodos();
  
  // Save yesterday's todos to history before resetting
  if (currentTodos.length > 0) {
    saveDailyLog(currentTodos);
  }
  
  // Instead of resetting completely, just reset the completion status
  // This way tasks stay forever but get reset for the new day
  const resetTodos = currentTodos.map(todo => ({
    ...todo,
    completed: false,
    completedAt: null
  }));
  
  saveTodos(resetTodos);
  return resetTodos;
};
