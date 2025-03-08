
import { useState } from "react";
import { Priority } from "@/types/todo";
import { useTodo } from "@/contexts/TodoContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";

interface NewTodoProps {
  onClose: () => void;
}

export function NewTodo({ onClose }: NewTodoProps) {
  const { addTodo } = useTodo();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim(), priority);
      setText("");
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card border border-border rounded-lg p-3 animate-fade-in">
      <div className="flex flex-col gap-3">
        <Input 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="What needs to be done?"
          className="border border-border"
          autoFocus
        />
        
        <div className="flex gap-2">
          <Select 
            value={priority} 
            onValueChange={(value) => setPriority(value as Priority)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-1">
            <Button type="submit" variant="ghost" size="icon">
              <Check className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
