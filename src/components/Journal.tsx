
import { useState, useEffect } from "react";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalList } from "@/components/JournalList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, BarChart, Calendar, Quote } from "lucide-react";
import { JournalEntry as JournalEntryType } from "@/types/journal";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { JournalCalendar } from "@/components/JournalCalendar";
import { MotivationalQuotes } from "@/components/MotivationalQuotes";

const WELCOME_MESSAGE_KEY = "welcomeMessageShown";

export function Journal() {
  const [refreshList, setRefreshList] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Check if welcome message has been shown
    const welcomeShown = localStorage.getItem(WELCOME_MESSAGE_KEY);
    if (!welcomeShown) {
      setShowWelcome(true);
    }
  }, []);
  
  const handleWelcomeClose = () => {
    localStorage.setItem(WELCOME_MESSAGE_KEY, "true");
    setShowWelcome(false);
  };
  
  const handleJournalSave = (entry: JournalEntryType) => {
    // Force refresh the journal list when a new entry is saved
    setRefreshList(prev => prev + 1);
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Welcome Dialog */}
      <AlertDialog open={showWelcome} onOpenChange={setShowWelcome}>
        <AlertDialogContent className="bg-gradient-to-br from-todo-purple/20 to-purple-900/30 backdrop-blur-md border border-purple-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gradient-primary text-2xl">Welcome to Your Journal</AlertDialogTitle>
            <AlertDialogDescription className="text-white/90">
              Your personal space for reflection and growth. Track your moods, record your thoughts, and discover insights about yourself.
              <div className="mt-4 p-3 bg-black/20 rounded-md border border-purple-500/30">
                <p className="italic text-purple-300">
                  "The journal is a vehicle for my sense of selfhood. It represents me as emotionally and spiritually independent."
                  <span className="block text-right mt-1 text-sm">- Susan Sontag</span>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleWelcomeClose} className="bg-purple-600 text-white hover:bg-purple-700">
              Get Started
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <h1 className="text-2xl font-bold text-gradient-primary">Daily Journal</h1>
      
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="bg-todo-gray/80 backdrop-blur-sm mb-4 border border-purple-500/10">
          <TabsTrigger value="new" className="flex items-center gap-2 data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">New Entry</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Past Entries</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Monthly View</span>
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-2 data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">
            <Quote className="h-4 w-4" />
            <span className="hidden sm:inline">Quotes</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">
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
        
        <TabsContent value="calendar" className="focus-visible:outline-none">
          <div className="h-[calc(100vh-250px)] min-h-[500px] overflow-y-auto">
            <JournalCalendar />
          </div>
        </TabsContent>
        
        <TabsContent value="quotes" className="focus-visible:outline-none">
          <div className="h-[calc(100vh-250px)] min-h-[500px] overflow-y-auto">
            <MotivationalQuotes />
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="focus-visible:outline-none">
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Mood Insights</CardTitle>
              <CardDescription className="text-purple-300/70">View your emotional trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-purple-300/50">
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
