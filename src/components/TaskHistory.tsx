
import { useTodo } from "@/contexts/TodoContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Clock, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { DailyLog, Todo } from "@/types/todo";

export function TaskHistory() {
  const { logs } = useTodo();

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedLogs.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No history yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Complete your first day to see history
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {sortedLogs.map((log) => (
            <LogItem key={log.date} log={log} />
          ))}
        </Accordion>
      )}
    </div>
  );
}

function LogItem({ log }: { log: DailyLog }) {
  const formattedDate = format(new Date(log.date), "EEEE, MMMM d, yyyy");
  const completionRate = log.totalCount > 0 
    ? Math.round((log.completedCount / log.totalCount) * 100) 
    : 0;

  return (
    <AccordionItem 
      value={log.date} 
      className="glass-card border border-border rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/10">
        <div className="flex flex-1 items-center justify-between">
          <span className="font-medium">{formattedDate}</span>
          <div className="flex items-center gap-4 mr-4">
            <span className="text-sm flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {completionRate}%
            </span>
            <span className="text-sm text-muted-foreground">
              {log.completedCount}/{log.totalCount} tasks
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3">
        <div className="space-y-2 mt-2">
          {log.todos.map((todo: Todo) => (
            <HistoryTodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function HistoryTodoItem({ todo }: { todo: Todo }) {
  const priorityColor = {
    low: "text-blue-400",
    medium: "text-yellow-400",
    high: "text-red-400"
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-2 rounded-md", 
      todo.completed ? "bg-secondary/30" : "bg-muted/10"
    )}>
      {todo.completed ? (
        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate", 
          todo.completed && "text-muted-foreground"
        )}>
          {todo.text}
        </p>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs", priorityColor[todo.priority])}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
          
          {todo.completedAt && (
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {format(parseISO(todo.completedAt), "HH:mm")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
