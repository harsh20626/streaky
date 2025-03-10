export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  priority: 'high' | 'medium' | 'low';
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
  createdAt?: string;
  bio?: string;
  settings?: {
    theme: string;
    notifications: boolean;
    privacy: string;
  };
}
