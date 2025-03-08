
export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  completedAt: string | null;
}

export interface DailyLog {
  date: string;
  todos: Todo[];
  completedCount: number;
  totalCount: number;
}

export interface Analytics {
  streakCount: number;
  longestStreak: number;
  completionRates: {
    date: string;
    rate: number;
  }[];
  frequentTasks: {
    text: string;
    count: number;
  }[];
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // after how many work sessions
}

export type PomodoroStatus = 'idle' | 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroState {
  status: PomodoroStatus;
  timeRemaining: number; // in seconds
  currentSession: number;
  isActive: boolean;
  selectedTodoId: string | null;
}
