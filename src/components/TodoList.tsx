
import { useTodo } from "@/contexts/TodoContext";
import { TodoItem } from "@/components/TodoItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { NewTodo } from "@/components/NewTodo";
import { Todo } from "@/types/todo";

export function TodoList() {
  const { todos, isLoading } = useTodo();
  const [showNewTodo, setShowNewTodo] = useState(false);

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
