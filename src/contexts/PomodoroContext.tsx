
import { createContext, useContext, useEffect, useState } from "react";
import { PomodoroSettings, PomodoroState, PomodoroStatus } from "@/types/todo";
import { toast } from "sonner";

interface PomodoroContextType {
  settings: PomodoroSettings;
  state: PomodoroState;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  startTimer: (todoId?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToNext: () => void;
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  notifications: true,
};

const defaultState: PomodoroState = {
  status: 'idle',
  timeRemaining: defaultSettings.workDuration * 60,
  currentSession: 1,
  totalSessions: 0,
  isActive: false,
  selectedTodoId: null,
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('pomodoroSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error loading pomodoro settings:', error);
      return defaultSettings;
    }
  });
  
  const [state, setState] = useState<PomodoroState>(() => {
    try {
      const savedState = localStorage.getItem('pomodoroState');
      return savedState ? JSON.parse(savedState) : {
        ...defaultState,
        timeRemaining: settings.workDuration * 60
      };
    } catch (error) {
      console.error('Error loading pomodoro state:', error);
      return {
        ...defaultState,
        timeRemaining: settings.workDuration * 60
      };
    }
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [state]);

  // Timer effect
  useEffect(() => {
    let timer: number | undefined;
    
    if (state.isActive && state.timeRemaining > 0) {
      timer = window.setInterval(() => {
        setState(prevState => ({
          ...prevState,
          timeRemaining: prevState.timeRemaining - 1
        }));
      }, 1000);
    } else if (state.isActive && state.timeRemaining === 0) {
      // Time's up, move to the next session
      handleTimerComplete();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isActive, state.timeRemaining]);

  const handleTimerComplete = () => {
    // Play notification sound if available
    try {
      const audio = new Audio('/notification.mp3');
      audio.play();
    } catch (error) {
      console.log('Audio notification not available');
    }
    
    let nextStatus: PomodoroStatus;
    let nextTimeRemaining: number;
    let nextSession = state.currentSession;
    let nextTotalSessions = state.totalSessions;
    
    // Determine next status based on current status
    if (state.status === 'work') {
      // After work, determine if it's time for a long break or short break
      nextTotalSessions = state.totalSessions + 1;
      if (state.currentSession % settings.longBreakInterval === 0) {
        nextStatus = 'longBreak';
        nextTimeRemaining = settings.longBreakDuration * 60;
        toast.success("Time for a long break! Well done!");
      } else {
        nextStatus = 'shortBreak';
        nextTimeRemaining = settings.shortBreakDuration * 60;
        toast.success("Short break time! Stretch a bit!");
      }
    } else {
      // After any break, go back to work and increment session
      nextStatus = 'work';
      nextTimeRemaining = settings.workDuration * 60;
      nextSession += 1;
      toast.success("Break's over! Time to focus again!");
    }
    
    setState({
      ...state,
      status: nextStatus,
      timeRemaining: nextTimeRemaining,
      currentSession: nextSession,
      totalSessions: nextTotalSessions,
      isActive: settings.autoStartBreaks, // Auto-start based on settings
    });
  };

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Reset timer with new settings if the timer is not active
      if (!state.isActive) {
        setState({
          ...defaultState,
          timeRemaining: updated.workDuration * 60
        });
      }
      return updated;
    });
  };

  const startTimer = (todoId?: string) => {
    if (state.status === 'idle') {
      setState({
        ...state,
        status: 'work',
        timeRemaining: settings.workDuration * 60,
        isActive: true,
        selectedTodoId: todoId || state.selectedTodoId
      });
      toast.info("Pomodoro timer started! Focus time!");
    } else {
      setState({
        ...state,
        isActive: true,
        selectedTodoId: todoId || state.selectedTodoId
      });
      toast.info("Timer resumed!");
    }
  };

  const pauseTimer = () => {
    setState({
      ...state,
      isActive: false
    });
    toast.info("Timer paused");
  };

  const resetTimer = () => {
    setState({
      ...defaultState,
      timeRemaining: settings.workDuration * 60
    });
    toast.info("Timer reset");
  };

  const skipToNext = () => {
    handleTimerComplete();
    toast.info("Skipped to next session");
  };

  const contextValue: PomodoroContextType = {
    settings,
    state,
    updateSettings,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNext
  };

  return (
    <PomodoroContext.Provider value={contextValue}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
}
