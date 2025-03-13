
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
import { motion, AnimatePresence } from "framer-motion";

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
  
  const priorityGradient = {
    low: "from-blue-500/20 to-blue-600/10",
    medium: "from-yellow-500/20 to-yellow-600/10",
    high: "from-red-500/20 to-red-600/10"
  };

  const isCurrentTimerTodo = state.selectedTodoId === todo.id && state.status !== 'idle';

  if (isEditing) {
    return (
      <motion.div
        initial={{ scale: 0.98, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 p-3 border border-white/10 rounded-lg glass-card bg-gradient-to-br from-slate-800/70 to-slate-900/70"
      >
        <div className="flex-1 flex gap-2">
          <Input 
            value={editText} 
            onChange={(e) => setEditText(e.target.value)} 
            className="flex-1 bg-white/5 border-white/20 text-white focus:ring-2 focus:ring-white/30"
            placeholder="Task description"
            autoFocus
          />
          
          <Select 
            value={editPriority} 
            onValueChange={(value) => setEditPriority(value as Priority)}
          >
            <SelectTrigger className="w-[110px] bg-white/5 border-white/20 text-white">
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
            className="hover:bg-green-500/20 text-green-400"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleCancel}
            title="Cancel"
            className="hover:bg-red-500/20 text-red-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={cn(
        "flex items-center gap-3 p-3 border border-white/10 rounded-lg glass-card transition-all duration-200",
        todo.completed ? "opacity-60 bg-gradient-to-br from-slate-800/50 to-slate-900/50" : 
          `bg-gradient-to-br ${priorityGradient[todo.priority]}`,
        isCurrentTimerTodo && "border-todo-purple/60 bg-gradient-to-br from-todo-purple/20 to-purple-900/20"
      )}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Checkbox 
        checked={todo.completed} 
        onCheckedChange={() => toggleTodo(todo.id)}
        className={cn(
          "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-purple-700 data-[state=checked]:text-primary-foreground",
          !todo.completed && "border-white/30"
        )}
      />
      
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.p 
            key={`text-${todo.completed}`}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "text-sm font-medium transition-all", 
              todo.completed ? "line-through text-white/50" : "text-white"
            )}
          >
            {todo.text}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn("text-xs", priorityColor[todo.priority])}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
          </span>
          
          {isCurrentTimerTodo && (
            <motion.span 
              className="text-xs bg-todo-purple/20 text-todo-purple px-2 py-0.5 rounded-full flex items-center gap-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Timer className="h-3 w-3" /> Active
            </motion.span>
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
            className="hover:bg-purple-500/20 text-purple-400"
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
          className="hover:bg-blue-500/20 text-blue-400"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => deleteTodo(todo.id)}
          title="Delete"
          className="hover:bg-red-500/20 text-red-400"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
