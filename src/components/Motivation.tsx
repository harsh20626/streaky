
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Rocket, Zap, Star, Trophy, Heart, ThumbsUp, Flame } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MotivationalQuote {
  quote: string;
  author: string;
  category?: string;
}

const INITIAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "success"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "belief"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion"
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "perseverance"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams"
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "persistence"
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    category: "dreams"
  },
  {
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "belief"
  },
  {
    quote: "Quality is not an act, it is a habit.",
    author: "Aristotle",
    category: "habits"
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "life"
  }
];

const MotivationIcons = {
  success: Trophy,
  belief: Star,
  passion: Heart,
  perseverance: Zap,
  dreams: Rocket,
  persistence: Flame,
  habits: ThumbsUp,
  life: Zap
};

export function Motivation() {
  const [quotes, setQuotes] = useState<MotivationalQuote[]>(INITIAL_QUOTES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favoriteQuotes, setFavoriteQuotes] = useState<MotivationalQuote[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteQuotes');
    if (savedFavorites) {
      setFavoriteQuotes(JSON.parse(savedFavorites));
    }
    
    // Extract unique categories
    const allCategories = [...new Set(INITIAL_QUOTES.map(q => q.category || 'general'))];
    setCategories(allCategories);
  }, []);

  const toggleFavorite = (quote: MotivationalQuote) => {
    let updatedFavorites: MotivationalQuote[];
    
    const isAlreadyFavorite = favoriteQuotes.some(q => q.quote === quote.quote);
    
    if (isAlreadyFavorite) {
      updatedFavorites = favoriteQuotes.filter(q => q.quote !== quote.quote);
    } else {
      updatedFavorites = [...favoriteQuotes, quote];
    }
    
    setFavoriteQuotes(updatedFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
  };

  const getFilteredQuotes = () => {
    if (activeCategory === 'all') {
      return quotes;
    } else if (activeCategory === 'favorites') {
      return favoriteQuotes;
    } else {
      return quotes.filter(quote => quote.category === activeCategory);
    }
  };

  const QuoteCard = ({ quote }: { quote: MotivationalQuote }) => {
    const isActive = favoriteQuotes.some(q => q.quote === quote.quote);
    const IconComponent = quote.category ? MotivationIcons[quote.category as keyof typeof MotivationIcons] || Star : Star;
    
    return (
      <Card className="bg-todo-gray/50 backdrop-blur-sm border border-purple-500/10">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className={`p-3 rounded-full ${isActive ? 'bg-amber-500/20' : 'bg-purple-900/30'}`}>
              <IconComponent className={`h-6 w-6 ${isActive ? 'text-amber-400' : 'text-purple-400'}`} />
            </div>
            <div className="flex-1">
              <p className="text-white/90 italic mb-3">{quote.quote}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-purple-300/70">— {quote.author}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${isActive ? 'text-amber-400' : 'text-purple-300/70'}`}
                  onClick={() => toggleFavorite(quote)}
                >
                  {isActive ? 'Favorited' : 'Favorite'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Daily Motivation</CardTitle>
            <CardDescription className="text-purple-300/70">
              Log in to view and save motivational quotes
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gradient-primary">Daily Motivation</h1>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="mb-6">
          <TabsList className="bg-todo-gray/80 backdrop-blur-sm border border-purple-500/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">
              All Quotes
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300">
              My Favorites
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300 hidden md:inline-flex"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value={activeCategory} className="focus-visible:outline-none">
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary">
                {activeCategory === 'all' ? 'All Motivational Quotes' : 
                 activeCategory === 'favorites' ? 'My Favorite Quotes' :
                 `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Quotes`}
              </CardTitle>
              <CardDescription className="text-purple-300/70">
                {activeCategory === 'favorites' ? 
                  'Quotes you have saved for inspiration' :
                  'Find inspiration and motivation for your day'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)] min-h-[400px]">
                <div className="space-y-4 pr-4">
                  {getFilteredQuotes().length === 0 ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <p className="text-purple-300/50">
                        {activeCategory === 'favorites' ? 
                          'No favorite quotes yet. Click "Favorite" on quotes you like.' :
                          'No quotes found for this category.'}
                      </p>
                    </div>
                  ) : (
                    getFilteredQuotes().map((quote, index) => (
                      <QuoteCard key={index} quote={quote} />
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
