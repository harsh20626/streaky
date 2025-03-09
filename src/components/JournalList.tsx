
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { getJournals } from "@/lib/journal-utils";
import { JournalEntry } from "@/types/journal";
import { Smile, Frown, Meh, Heart, Star, Sparkles, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

// Mood icon mapping
const moodIcons = {
  happy: Smile,
  sad: Frown,
  neutral: Meh,
  love: Heart,
  motivated: Star,
  inspired: Sparkles,
};

// Mood color mapping
const moodColors = {
  happy: "border-green-500 bg-green-500/10",
  sad: "border-blue-500 bg-blue-500/10",
  neutral: "border-gray-500 bg-gray-500/10",
  love: "border-pink-500 bg-pink-500/10",
  motivated: "border-yellow-500 bg-yellow-500/10",
  inspired: "border-purple-500 bg-purple-500/10",
};

export function JournalList() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const { user } = useAuth();

  // Load journals on mount
  useEffect(() => {
    setJournals(getJournals());
  }, []);
  
  // If no journals exist
  if (journals.length === 0) {
    return (
      <Card className="w-full bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Journal Entries</CardTitle>
          <CardDescription className="text-purple-300/70">View your past journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center flex-col gap-4">
            <CalendarDays className="h-12 w-12 text-purple-300/30" />
            <p className="text-purple-300/50 text-center">
              No journal entries yet.<br />
              Start writing to track your thoughts and feelings.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
      <CardHeader>
        <CardTitle className="text-gradient-primary">Journal Entries</CardTitle>
        <CardDescription className="text-purple-300/70">Your recent thoughts and feelings</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] min-h-[400px] pr-4">
          <div className="space-y-4">
            {journals.map(journal => {
              const MoodIcon = moodIcons[journal.mood as keyof typeof moodIcons] || Meh;
              const moodColor = moodColors[journal.mood as keyof typeof moodColors] || "border-gray-500 bg-gray-500/10";
              const date = new Date(journal.createdAt).toLocaleDateString();
              const time = new Date(journal.createdAt).toLocaleTimeString();
              
              let sentimentClass = "border-gray-500";
              if (journal.sentimentScore !== undefined) {
                if (journal.sentimentScore > 0.3) sentimentClass = "border-green-500";
                else if (journal.sentimentScore < -0.3) sentimentClass = "border-red-500";
                else sentimentClass = "border-yellow-500";
              }
              
              return (
                <Card key={journal.id} 
                  className={`bg-todo-gray/50 backdrop-blur-sm border-l-4 ${sentimentClass} hover:bg-todo-gray/70 transition-colors`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-white">{journal.title}</CardTitle>
                      <Badge variant="outline" 
                        className={`flex items-center gap-1 ${moodColor}`}>
                        <MoodIcon className="h-3 w-3" />
                        <span>{journal.mood}</span>
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs text-purple-300/70">
                      <CalendarDays className="h-3 w-3" /> {date} at {time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-white/80">{journal.content}</p>
                  </CardContent>
                  {journal.tags && journal.tags.length > 0 && (
                    <CardFooter className="pt-0 flex flex-wrap gap-1">
                      {journal.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-purple-900/30 text-purple-300">{tag}</Badge>
                      ))}
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
