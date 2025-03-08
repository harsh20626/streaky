
export type MoodType = 'happy' | 'sad' | 'neutral' | 'love' | 'motivated' | 'inspired' | 'anxious' | 'tired' | 'calm';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sentimentScore?: number; // AI sentiment analysis score
}

export interface JournalInsight {
  date: string;
  moodScore: number; // -1 to 1, where -1 is very negative, 1 is very positive
  wordCount: number;
  topEmotions: string[];
}

export interface JournalStats {
  totalEntries: number;
  streakDays: number;
  mostFrequentMood: MoodType;
  averageSentiment: number;
  weeklyMoodData: {
    date: string;
    score: number;
  }[];
}
