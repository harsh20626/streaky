
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
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton className="h-12 w-full bg-white/5" />
        <Skeleton className="h-12 w-full bg-white/5" />
        <Skeleton className="h-12 w-full bg-white/5" />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {showStreakMessage && (
          <motion.div 
            className="glass-card rounded-lg p-4 border border-yellow-500/30 bg-gradient-to-r from-yellow-500/20 to-amber-500/10"
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}
        
        {showBadgeMessage && (
          <motion.div 
            className="glass-card rounded-lg p-4 border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/10"
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {showNewTodo ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <NewTodo onClose={closeNewTodo} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <Button 
            onClick={openNewTodo} 
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-900 text-white shadow-lg"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> 
            Add Task
          </Button>
        </motion.div>
      )}

      {analytics.streakCount > 0 && (
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="flex items-center justify-between px-4 py-3 glass-card rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-yellow-500/20"
        >
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
            <span className="text-sm">Current Streak</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 font-semibold">{analytics.streakCount} days</span>
            <Trophy className="h-4 w-4 text-yellow-400 ml-2" />
          </div>
        </motion.div>
      )}

      <motion.div 
        className="space-y-3"
        variants={containerVariants}
      >
        {sortedTodos.length === 0 ? (
          <motion.div 
            className="text-center py-10 glass-card rounded-lg border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30"
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <p className="text-white/80 mb-1">No tasks for today</p>
            <p className="text-xs text-white/60">
              Add a task to get started on your productive day
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {sortedTodos.map((todo: Todo) => (
              <motion.div
                key={todo.id}
                variants={itemVariants}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              >
                <TodoItem todo={todo} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}
