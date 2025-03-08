
import { useState } from "react";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { useTodo } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timer, Play, Pause, SkipForward, RefreshCw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function PomodoroTimer() {
  const { settings, state, startTimer, pauseTimer, resetTimer, skipToNext, updateSettings } = usePomodoro();
  const { todos } = useTodo();
  const [showSettings, setShowSettings] = useState(false);
  
  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (state.status) {
      case 'work': return 'text-red-500';
      case 'shortBreak': return 'text-green-500';
      case 'longBreak': return 'text-blue-500';
      default: return 'text-todo-purple';
    }
  };
  
  // Get status text
  const getStatusText = () => {
    switch (state.status) {
      case 'work': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Pomodoro Timer';
    }
  };
  
  // Get active task
  const activeTask = state.selectedTodoId 
    ? todos.find(todo => todo.id === state.selectedTodoId) 
    : null;
    
  // Settings component
  const SettingsDialog = () => (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pomodoro Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="workDuration" className="text-sm">Work Duration (minutes)</label>
            <Select 
              value={settings.workDuration.toString()} 
              onValueChange={(value) => updateSettings({ workDuration: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="25 minutes" />
              </SelectTrigger>
              <SelectContent>
                {[15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(value => (
                  <SelectItem key={value} value={value.toString()}>{value} minutes</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="shortBreak" className="text-sm">Short Break (minutes)</label>
            <Select 
              value={settings.shortBreakDuration.toString()} 
              onValueChange={(value) => updateSettings({ shortBreakDuration: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="5 minutes" />
              </SelectTrigger>
              <SelectContent>
                {[3, 5, 7, 10].map(value => (
                  <SelectItem key={value} value={value.toString()}>{value} minutes</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="longBreak" className="text-sm">Long Break (minutes)</label>
            <Select 
              value={settings.longBreakDuration.toString()} 
              onValueChange={(value) => updateSettings({ longBreakDuration: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="15 minutes" />
              </SelectTrigger>
              <SelectContent>
                {[10, 15, 20, 25, 30].map(value => (
                  <SelectItem key={value} value={value.toString()}>{value} minutes</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="interval" className="text-sm">Long Break Interval</label>
            <Select 
              value={settings.longBreakInterval.toString()} 
              onValueChange={(value) => updateSettings({ longBreakInterval: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="After 4 sessions" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6].map(value => (
                  <SelectItem key={value} value={value.toString()}>After {value} sessions</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setShowSettings(false)}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="border border-border rounded-lg glass-card p-4 animate-fade-in">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-todo-purple" />
          <h3 className="font-semibold text-lg">{getStatusText()}</h3>
        </div>
        
        <div className={cn("text-4xl font-bold my-2", getStatusColor())}>
          {formatTime(state.timeRemaining)}
        </div>
        
        {state.status !== 'idle' && (
          <div className="text-sm text-muted-foreground">
            Session {state.currentSession} {state.status === 'work' ? '' : `(${state.currentSession}/${settings.longBreakInterval})`}
          </div>
        )}
        
        {activeTask && (
          <div className="text-sm bg-background/30 px-3 py-1 rounded-full">
            Working on: <span className="font-medium">{activeTask.text}</span>
          </div>
        )}
        
        <div className="flex gap-2 mt-2">
          {state.isActive ? (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={pauseTimer}
              className="bg-background/30"
              title="Pause"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => startTimer()}
              className="bg-background/30"
              title="Start/Resume"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetTimer}
            className="bg-background/30"
            title="Reset"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={skipToNext}
            className="bg-background/30"
            title="Skip to Next"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowSettings(true)}
            className="bg-background/30"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <SettingsDialog />
    </div>
  );
}
