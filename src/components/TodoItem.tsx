
import { useState } from "react";
import { Todo, Priority } from "@/types/todo";
import { useTodo } from "@/contexts/TodoContext";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Pencil, Check, X, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, editTodo } = useTodo();
  const { startTimer, state } = usePomodoro();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditPriority(todo.priority);
  };

  const handleSave = () => {
    if (editText.trim()) {
      editTodo(todo.id, editText, editPriority);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditPriority(todo.priority);
  };

  const handleStartTimer = () => {
    startTimer(todo.id);
  };

  const priorityColor = {
    low: "text-blue-400",
    medium: "text-yellow-400",
    high: "text-red-400"
  };

  const isCurrentTimerTodo = state.selectedTodoId === todo.id && state.status !== 'idle';

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 border border-border rounded-lg glass-card animate-fade-in">
        <div className="flex-1 flex gap-2">
          <Input 
            value={editText} 
            onChange={(e) => setEditText(e.target.value)} 
            className="flex-1"
            placeholder="Task description"
            autoFocus
          />
          
          <Select 
            value={editPriority} 
            onValueChange={(value) => setEditPriority(value as Priority)}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleSave}
            title="Save"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleCancel}
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 border border-border rounded-lg glass-card animate-fade-in transition-all duration-200",
      todo.completed && "opacity-60",
      isCurrentTimerTodo && "border-todo-purple/60 bg-todo-purple/10"
    )}>
      <Checkbox 
        checked={todo.completed} 
        onCheckedChange={() => toggleTodo(todo.id)}
        className="data-[state=checked]:bg-todo-purple data-[state=checked]:text-primary-foreground"
      />
      
      <div className="flex-1">
        <p className={cn(
          "text-sm font-medium transition-all", 
          todo.completed && "line-through text-muted-foreground"
        )}>
          {todo.text}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn("text-xs", priorityColor[todo.priority])}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
          </span>
          
          {isCurrentTimerTodo && (
            <span className="text-xs bg-todo-purple/20 text-todo-purple px-2 py-0.5 rounded-full flex items-center gap-1">
              <Timer className="h-3 w-3" /> Active
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-1">
        {!todo.completed && !isCurrentTimerTodo && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleStartTimer}
            title="Start Timer"
          >
            <Timer className="h-4 w-4" />
          </Button>
        )}
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleEdit}
          disabled={todo.completed}
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => deleteTodo(todo.id)}
          title="Delete"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
