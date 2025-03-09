
import { useTodo } from "@/contexts/TodoContext";
import { TodoItem } from "@/components/TodoItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon, Sparkles, Trophy, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { NewTodo } from "@/components/NewTodo";
import { Todo } from "@/types/todo";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function TodoList() {
  const { todos, isLoading, analytics } = useTodo();
  const { user } = useAuth();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [showStreakMessage, setShowStreakMessage] = useState(false);
  const [showBadgeMessage, setShowBadgeMessage] = useState(false);

  // Check for achievements on load and when streak changes
  useEffect(() => {
    // Only show messages if user is logged in
    if (!user) return;
    
    // If we have a streak of 3+ days, show streak message
    if (analytics.streakCount >= 3 && !localStorage.getItem('streakMessage3')) {
      setShowStreakMessage(true);
      localStorage.setItem('streakMessage3', 'true');
    }
    
    // If we've completed 5+ tasks, show badge message
    const completedTotal = analytics.frequentTasks.reduce((sum, task) => sum + task.count, 0);
    if (completedTotal >= 5 && !localStorage.getItem('badgeMessage5')) {
      setShowBadgeMessage(true);
      localStorage.setItem('badgeMessage5', 'true');
    }
  }, [analytics, user]);

  const sortedTodos = [...todos].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by priority (high > medium > low)
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const openNewTodo = () => {
    setShowNewTodo(true);
  };

  const closeNewTodo = () => {
    setShowNewTodo(false);
  };

  const dismissStreakMessage = () => {
    setShowStreakMessage(false);
  };

  const dismissBadgeMessage = () => {
    setShowBadgeMessage(false);
  };

  // Show welcome message just once
  useEffect(() => {
    if (!localStorage.getItem('welcomeShown') && user) {
      toast.success('Welcome to Streaky!', {
        description: 'Track your tasks, maintain streaks, and level up your productivity.',
        duration: 5000,
      });
      localStorage.setItem('welcomeShown', 'true');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showStreakMessage && (
        <div className="glass-card rounded-lg p-4 border border-yellow-500/30 bg-yellow-500/10 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <h3 className="font-medium text-white">Achievement Unlocked!</h3>
                <p className="text-sm text-yellow-300/70">You've maintained a 3-day streak. Keep it up!</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={dismissStreakMessage}>
              Dismiss
            </Button>
          </div>
        </div>
      )}
      
      {showBadgeMessage && (
        <div className="glass-card rounded-lg p-4 border border-purple-500/30 bg-purple-500/10 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-purple-400 mr-3" />
              <div>
                <h3 className="font-medium text-white">Badge Earned: Task Master</h3>
                <p className="text-sm text-purple-300/70">You've completed 5+ tasks. View your profile to see all badges!</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={dismissBadgeMessage}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {showNewTodo ? (
        <NewTodo onClose={closeNewTodo} />
      ) : (
        <Button 
          onClick={openNewTodo} 
          className="w-full bg-todo-purple hover:bg-todo-purple/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> 
          Add Task
        </Button>
      )}

      {analytics.streakCount > 0 && (
        <div className="flex items-center justify-between px-4 py-2 glass-card rounded-lg">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-sm">Current Streak</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 font-semibold">{analytics.streakCount} days</span>
            <Trophy className="h-4 w-4 text-yellow-400 ml-2" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-8 glass-card rounded-lg border border-border">
            <p className="text-muted-foreground">No tasks for today</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add a task to get started
            </p>
          </div>
        ) : (
          sortedTodos.map((todo: Todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
}
