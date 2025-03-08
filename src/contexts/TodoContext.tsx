
import { createContext, useContext, useEffect, useState } from "react";
import { Analytics, DailyLog, Priority, Todo } from "@/types/todo";
import { 
  generateId, 
  getAnalytics, 
  getDailyLogs, 
  getLastUpdated, 
  getToday, 
  getTodos, 
  resetTodosForNewDay, 
  saveDailyLog, 
  saveTodos, 
  shouldResetTodos, 
  updateAnalytics 
} from "@/lib/todo-utils";
import { toast } from "sonner";

interface TodoContextType {
  todos: Todo[];
  logs: DailyLog[];
  analytics: Analytics;
  addTodo: (text: string, priority: Priority) => void;
  editTodo: (id: string, text: string, priority: Priority) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  isLoading: boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    streakCount: 0,
    longestStreak: 0,
    completionRates: [],
    frequentTasks: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data and check for day change on initial load
  useEffect(() => {
    const initTodos = () => {
      setIsLoading(true);
      
      try {
        const lastUpdated = getLastUpdated();
        
        // Check if we need to reset todos for a new day
        if (shouldResetTodos(lastUpdated)) {
          setTodos(resetTodosForNewDay());
          toast("New day, fresh tasks!", {
            description: "Yesterday's tasks have been archived"
          });
        } else {
          // Just load todos normally
          setTodos(getTodos());
        }
        
        // Load logs and analytics
        setLogs(getDailyLogs());
        setAnalytics(getAnalytics());
      } catch (error) {
        console.error("Error initializing todos:", error);
        toast.error("Error loading your tasks");
      } finally {
        setIsLoading(false);
      }
    };

    initTodos();
    
    // Set up midnight check
    const checkForDayChange = () => {
      const lastUpdated = getLastUpdated();
      if (shouldResetTodos(lastUpdated)) {
        initTodos();
      }
    };
    
    // Check for day change every minute
    const interval = setInterval(checkForDayChange, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Add a new todo
  const addTodo = (text: string, priority: Priority) => {
    if (!text.trim()) return;
    
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    saveDailyLog(updatedTodos);
    
    // Refresh analytics and logs
    setLogs(getDailyLogs());
    setAnalytics(getAnalytics());
    
    toast.success("Task added");
  };

  // Edit a todo
  const editTodo = (id: string, text: string, priority: Priority) => {
    if (!text.trim()) return;
    
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, text, priority } : todo
    );
    
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    saveDailyLog(updatedTodos);
    
    // Refresh analytics and logs
    setLogs(getDailyLogs());
    setAnalytics(getAnalytics());
    
    toast.success("Task updated");
  };

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        return { 
          ...todo, 
          completed,
          completedAt: completed ? new Date().toISOString() : null
        };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    saveDailyLog(updatedTodos);
    
    // Refresh analytics and logs
    setLogs(getDailyLogs());
    setAnalytics(getAnalytics());
    
    const completedTodo = updatedTodos.find(todo => todo.id === id);
    if (completedTodo?.completed) {
      toast.success("Task completed!");
    }
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    saveDailyLog(updatedTodos);
    
    // Refresh analytics and logs
    setLogs(getDailyLogs());
    setAnalytics(getAnalytics());
    
    toast.success("Task removed");
  };

  const contextValue: TodoContextType = {
    todos,
    logs,
    analytics,
    addTodo,
    editTodo,
    toggleTodo,
    deleteTodo,
    isLoading
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
