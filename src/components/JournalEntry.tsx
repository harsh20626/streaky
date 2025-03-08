
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smile, Frown, Meh, Heart, Star, Sparkles } from "lucide-react";

const moodOptions = [
  { value: "happy", label: "Happy", icon: Smile },
  { value: "sad", label: "Sad", icon: Frown },
  { value: "neutral", label: "Neutral", icon: Meh },
  { value: "love", label: "In Love", icon: Heart },
  { value: "motivated", label: "Motivated", icon: Star },
  { value: "inspired", label: "Inspired", icon: Sparkles },
];

export function JournalEntry() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save journal entry logic would go here
    console.log({ title, content, mood });
    
    // Reset form
    setTitle("");
    setContent("");
    setMood("");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gradient-primary">New Journal Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Entry Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="How are you feeling today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-y"
              required
            />
          </div>
          <div>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((option) => {
                  const MoodIcon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <MoodIcon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Save Entry</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
