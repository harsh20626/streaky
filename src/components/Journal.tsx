
import { JournalEntry } from "@/components/JournalEntry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Edit, BarChart, Calendar } from "lucide-react";

export function Journal() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-gradient">Daily Journal</h1>
      
      <div className="h-[calc(100vh-250px)] min-h-[500px]">
        <JournalEntry />
      </div>
      
    </div>
  );
}
