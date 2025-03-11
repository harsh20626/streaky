
export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  priority: Priority;
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
  completionRates: { date: string; rate: number }[];
  frequentTasks: { text: string; count: number }[];
  completedTasks?: number;
  journalCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  photoUrl?: string; // Added for backward compatibility
  createdAt?: string;
  bio?: string;
  settings?: {
    theme: string;
    notifications: boolean;
    privacy: string;
  };
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  notifications: boolean;
}

export interface PomodoroState {
  status: PomodoroStatus;
  timeRemaining: number;
  currentSession: number;
  totalSessions: number;
}

export type PomodoroStatus = 'work' | 'shortBreak' | 'longBreak' | 'idle';
