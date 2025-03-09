
import { useState } from "react";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalList } from "@/components/JournalList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, BarChart, Calendar } from "lucide-react";
import { JournalEntry as JournalEntryType } from "@/types/journal";

export function Journal() {
  const [refreshList, setRefreshList] = useState(0);
  
  const handleJournalSave = (entry: JournalEntryType) => {
    // Force refresh the journal list when a new entry is saved
    setRefreshList(prev => prev + 1);
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-gradient">Daily Journal</h1>
      
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="bg-todo-gray mb-4">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">New Entry</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Past Entries</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="focus-visible:outline-none">
          <div className="h-[calc(100vh-250px)] min-h-[500px] overflow-y-auto">
            <JournalEntry onSave={handleJournalSave} />
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="focus-visible:outline-none">
          <div className="h-[calc(100vh-250px)] min-h-[500px] overflow-y-auto">
            <JournalList key={refreshList} />
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="focus-visible:outline-none">
          <Card>
            <CardHeader>
              <CardTitle>Mood Insights</CardTitle>
              <CardDescription>View your emotional trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Start writing journal entries to see your mood insights
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
