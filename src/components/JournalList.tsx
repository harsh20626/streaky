
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { getJournals } from "@/lib/journal-utils";
import { JournalEntry } from "@/types/journal";
import { Smile, Frown, Meh, Heart, Star, Sparkles, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mood icon mapping
const moodIcons = {
  happy: Smile,
  sad: Frown,
  neutral: Meh,
  love: Heart,
  motivated: Star,
  inspired: Sparkles,
};

export function JournalList() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  // Load journals on mount
  useEffect(() => {
    setJournals(getJournals());
  }, []);
  
  // If no journals exist
  if (journals.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>View your past journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center flex-col gap-4">
            <CalendarDays className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground text-center">
              No journal entries yet.<br />
              Start writing to track your thoughts and feelings.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Journal Entries</CardTitle>
        <CardDescription>Your recent thoughts and feelings</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] min-h-[400px] pr-4">
          <div className="space-y-4">
            {journals.map(journal => {
              const MoodIcon = moodIcons[journal.mood as keyof typeof moodIcons] || Meh;
              const date = new Date(journal.createdAt).toLocaleDateString();
              const time = new Date(journal.createdAt).toLocaleTimeString();
              
              let sentimentClass = "bg-gray-200";
              if (journal.sentimentScore !== undefined) {
                if (journal.sentimentScore > 0.3) sentimentClass = "bg-green-200";
                else if (journal.sentimentScore < -0.3) sentimentClass = "bg-red-200";
                else sentimentClass = "bg-yellow-200";
              }
              
              return (
                <Card key={journal.id} className={`border-l-4 ${sentimentClass}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{journal.title}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MoodIcon className="h-3 w-3" />
                        <span>{journal.mood}</span>
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <CalendarDays className="h-3 w-3" /> {date} at {time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{journal.content}</p>
                  </CardContent>
                  {journal.tags && journal.tags.length > 0 && (
                    <CardFooter className="pt-0 flex flex-wrap gap-1">
                      {journal.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
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
