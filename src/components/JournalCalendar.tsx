
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getJournals } from "@/lib/journal-utils";
import { JournalEntry } from "@/types/journal";
import { format } from "date-fns";
import { Smile, Frown, Meh, Heart, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
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

// Mood color mapping
const moodColors = {
  happy: "bg-green-500 hover:bg-green-600",
  sad: "bg-blue-500 hover:bg-blue-600",
  neutral: "bg-gray-500 hover:bg-gray-600",
  love: "bg-pink-500 hover:bg-pink-600",
  motivated: "bg-yellow-500 hover:bg-yellow-600",
  inspired: "bg-purple-500 hover:bg-purple-600",
};

export function JournalCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [journalsByDate, setJournalsByDate] = useState<Record<string, JournalEntry[]>>({});
  const [selectedDateJournals, setSelectedDateJournals] = useState<JournalEntry[]>([]);

  // Load journals on mount
  useEffect(() => {
    const allJournals = getJournals();
    setJournals(allJournals);
    
    // Group journals by date
    const byDate = allJournals.reduce((acc, journal) => {
      const dateKey = new Date(journal.createdAt).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(journal);
      return acc;
    }, {} as Record<string, JournalEntry[]>);
    
    setJournalsByDate(byDate);
    
    // Set selected date journals
    if (date) {
      const dateKey = date.toISOString().split('T')[0];
      setSelectedDateJournals(byDate[dateKey] || []);
    }
  }, []);
  
  // Update selected date journals when date changes
  useEffect(() => {
    if (date) {
      const dateKey = date.toISOString().split('T')[0];
      setSelectedDateJournals(journalsByDate[dateKey] || []);
    }
  }, [date, journalsByDate]);

  return (
    <Card className="w-full bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
      <CardHeader>
        <CardTitle className="text-gradient-primary">Monthly Journal View</CardTitle>
        <CardDescription className="text-purple-300/70">View your moods and entries by date</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="bg-todo-gray/30 p-3 rounded-lg border border-purple-500/10 pointer-events-auto"
            modifiers={{
              booked: (date) => {
                const dateKey = date.toISOString().split('T')[0];
                return !!journalsByDate[dateKey];
              }
            }}
            modifiersStyles={{
              booked: {
                fontWeight: 'bold',
                border: '2px solid',
                borderColor: 'rgb(139, 92, 246)'
              }
            }}
            components={{
              DayContent: ({ date }) => {
                const dateKey = date.toISOString().split('T')[0];
                const dayJournals = journalsByDate[dateKey] || [];
                
                if (dayJournals.length === 0) {
                  return <div>{date.getDate()}</div>;
                }
                
                // Get the most common mood for the day
                const moodCounts = dayJournals.reduce((acc, journal) => {
                  acc[journal.mood] = (acc[journal.mood] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const mainMood = Object.entries(moodCounts)
                  .sort((a, b) => b[1] - a[1])[0][0] as keyof typeof moodIcons;
                
                const MoodIcon = moodIcons[mainMood] || Meh;
                
                return (
                  <div className="flex flex-col items-center">
                    <div>{date.getDate()}</div>
                    <MoodIcon className="h-3 w-3 text-todo-purple" />
                  </div>
                );
              }
            }}
          />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gradient-primary">
            {date ? format(date, "MMMM d, yyyy") : "Select a date"}
          </h3>
          
          {selectedDateJournals.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] bg-todo-gray/30 rounded-lg border border-purple-500/10">
              <p className="text-purple-300/50">No journal entries for this date</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3 pr-4">
                {selectedDateJournals.map(journal => {
                  const MoodIcon = moodIcons[journal.mood as keyof typeof moodIcons] || Meh;
                  const moodColor = moodColors[journal.mood as keyof typeof moodColors] || "bg-gray-500 hover:bg-gray-600";
                  
                  return (
                    <Card key={journal.id} className="bg-todo-gray/50 backdrop-blur-sm border border-purple-500/10">
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base text-white">{journal.title}</CardTitle>
                          <Badge className={`${moodColor} flex items-center gap-1`}>
                            <MoodIcon className="h-3 w-3" />
                            <span>{journal.mood}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-0 px-4 pb-3">
                        <p className="text-sm text-white/80 line-clamp-2">{journal.content}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
