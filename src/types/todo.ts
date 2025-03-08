
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
