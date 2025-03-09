
import { JournalEntry, JournalInsight, JournalStats } from "@/types/journal";
import { generateId, getToday } from "./todo-utils";

// Get journals from localStorage
export const getJournals = (): JournalEntry[] => {
  const journals = localStorage.getItem('journals');
  return journals ? JSON.parse(journals) : [];
};

// Save journal to localStorage
export const saveJournal = (journal: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): JournalEntry => {
  const journals = getJournals();
  
  const newJournal: JournalEntry = {
    id: generateId(),
    title: journal.title,
    content: journal.content,
    mood: journal.mood,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: journal.tags || [],
    sentimentScore: journal.sentimentScore
  };
  
  localStorage.setItem('journals', JSON.stringify([newJournal, ...journals]));
  
  // After saving, analyze sentiment if needed
  analyzeJournalSentiment(newJournal).catch(err => console.error("Error analyzing journal:", err));
  
  return newJournal;
};

// Get journal stats
export const getJournalStats = (): JournalStats => {
  const journals = getJournals();
  const stats = localStorage.getItem('journalStats');
  const defaultStats: JournalStats = {
    totalEntries: journals.length,
    streakDays: 0,
    mostFrequentMood: journals.length > 0 ? 
      (getMostFrequentMood(journals) || 'neutral') : 
      'neutral',
    averageSentiment: 0,
    weeklyMoodData: []
  };
  
  return stats ? { ...JSON.parse(stats), totalEntries: journals.length } : defaultStats;
};

// Helper to get most frequent mood
const getMostFrequentMood = (journals: JournalEntry[]) => {
  if (journals.length === 0) return null;
  
  const moodCounts = journals.reduce((acc, journal) => {
    acc[journal.mood] = (acc[journal.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0][0] as JournalEntry['mood'];
};

// Get weekly journal summary using OpenRouter API
export const getWeeklyJournalSummary = async (): Promise<string> => {
  const journals = getJournals();
  
  // Get entries from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentJournals = journals.filter(journal => 
    new Date(journal.createdAt) >= sevenDaysAgo
  );
  
  if (recentJournals.length === 0) {
    return "No journal entries in the past week.";
  }
  
  // Prepare the content for analysis
  const journalTexts = recentJournals.map(journal => 
    `Date: ${new Date(journal.createdAt).toLocaleDateString()}\nMood: ${journal.mood}\nTitle: ${journal.title}\nContent: ${journal.content}`
  ).join('\n\n');
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: "You are an AI that analyzes journal entries and provides insightful summaries about mood patterns, recurring themes, and suggestions for emotional well-being."
          },
          {
            role: "user",
            content: `Please analyze these journal entries from the past week and provide a concise summary (max 250 words) about mood patterns, recurring themes, and brief suggestions:\n\n${journalTexts}`
          }
        ],
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.error("Unexpected API response structure:", data);
      return "Unable to generate summary at this time.";
    }
  } catch (error) {
    console.error("Error getting journal summary:", error);
    return "Error generating weekly summary. Please try again later.";
  }
};

// Analyze journal sentiment using OpenRouter API
export const analyzeJournalSentiment = async (journal: JournalEntry): Promise<number> => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: "You are an AI that analyzes the sentiment of journal entries. Return only a number between -1 and 1, where -1 is very negative, 0 is neutral, and 1 is very positive."
          },
          {
            role: "user",
            content: `Analyze the sentiment of this journal entry. Return only a single number between -1 and 1.\n\nTitle: ${journal.title}\n\nContent: ${journal.content}`
          }
        ],
        max_tokens: 10
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const sentiment = parseFloat(data.choices[0].message.content.trim());
      
      if (!isNaN(sentiment) && sentiment >= -1 && sentiment <= 1) {
        // Update the journal with sentiment score
        const journals = getJournals();
        const updatedJournals = journals.map(j => 
          j.id === journal.id ? { ...j, sentimentScore: sentiment } : j
        );
        
        localStorage.setItem('journals', JSON.stringify(updatedJournals));
        return sentiment;
      }
    }
    
    return 0; // Default neutral sentiment
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 0;
  }
};

// Get journals by date
export const getJournalsByDate = (date: Date): JournalEntry[] => {
  const journals = getJournals();
  const dateString = date.toISOString().split('T')[0];
  
  return journals.filter(journal => {
    const journalDate = new Date(journal.createdAt).toISOString().split('T')[0];
    return journalDate === dateString;
  });
};

// Get a map of journal entries per day for a month
export const getMonthJournals = (month: number, year: number): Record<string, JournalEntry[]> => {
  const journals = getJournals();
  const result: Record<string, JournalEntry[]> = {};
  
  journals.forEach(journal => {
    const date = new Date(journal.createdAt);
    
    // Only include journals from the specified month and year
    if (date.getMonth() === month && date.getFullYear() === year) {
      const dateKey = date.toISOString().split('T')[0];
      
      if (!result[dateKey]) {
        result[dateKey] = [];
      }
      
      result[dateKey].push(journal);
    }
  });
  
  return result;
};
