
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, RefreshCw, Bookmark, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Motivational quotes data
const motivationalQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    tags: ["Work", "Passion"]
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    tags: ["Belief", "Confidence"]
  },
  {
    quote: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    tags: ["Time", "Life"]
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    tags: ["Dreams", "Future"]
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    tags: ["Perseverance", "Progress"]
  },
  {
    quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    tags: ["Success", "Courage"]
  },
  {
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    tags: ["Doubt", "Future"]
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    tags: ["Action", "Beginning"]
  },
  {
    quote: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    tags: ["Life", "Planning"]
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    tags: ["Future", "Creation"]
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    tags: ["Time", "Perseverance"]
  },
  {
    quote: "The harder I work, the luckier I get.",
    author: "Samuel Goldwyn",
    tags: ["Work", "Luck"]
  },
  {
    quote: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama",
    tags: ["Happiness", "Action"]
  },
  {
    quote: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    tags: ["Purpose", "Happiness"]
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    tags: ["Goals", "Dreams"]
  },
  {
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    tags: ["Adversity", "Hope"]
  },
  {
    quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar",
    tags: ["Goals", "Growth"]
  },
  {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    tags: ["Failure", "Perseverance"]
  },
  {
    quote: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    tags: ["Identity", "Choice"]
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    tags: ["Opportunity", "Risk"]
  }
];

const gradients = [
  "from-purple-600 to-blue-600",
  "from-blue-600 to-cyan-500",
  "from-cyan-500 to-teal-500",
  "from-teal-500 to-green-500",
  "from-green-500 to-lime-500",
  "from-lime-500 to-yellow-500",
  "from-yellow-500 to-amber-500",
  "from-amber-500 to-orange-500",
  "from-orange-500 to-red-500",
  "from-red-500 to-pink-500",
  "from-pink-500 to-purple-500",
  "from-purple-900 to-purple-600",
  "from-blue-900 to-blue-600",
  "from-teal-900 to-teal-600",
  "from-green-900 to-green-600",
  "from-yellow-900 to-yellow-600",
  "from-orange-900 to-orange-600",
  "from-red-900 to-red-600",
  "from-pink-900 to-pink-600",
  "from-purple-900 to-indigo-600",
];

type QuoteCardProps = {
  quote: string;
  author: string;
  tags?: string[];
};

function QuoteCard({ quote, author, tags = [] }: QuoteCardProps) {
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
  
  return (
    <Card className={`bg-gradient-to-br ${randomGradient} border-white/10 shadow-lg`}>
      <CardHeader>
        <Quote className="h-8 w-8 text-white/40" />
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold text-white mb-4">{quote}</p>
        <p className="text-white/80 italic">- {author}</p>
      </CardContent>
      {tags.length > 0 && (
        <CardFooter className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-white/10 text-white border-none text-xs">{tag}</Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}

export function MotivationalQuotes() {
  const [currentQuote, setCurrentQuote] = useState<typeof motivationalQuotes[0] | null>(null);
  const [favorites, setFavorites] = useState<typeof motivationalQuotes>([]);
  
  useEffect(() => {
    // Get a random quote on mount
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteQuotes');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  const getNewQuote = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    } while (
      currentQuote && 
      motivationalQuotes[randomIndex].quote === currentQuote.quote
    );
    
    setCurrentQuote(motivationalQuotes[randomIndex]);
  };
  
  const toggleFavorite = () => {
    if (!currentQuote) return;
    
    let updatedFavorites;
    const exists = favorites.some(fav => fav.quote === currentQuote.quote);
    
    if (exists) {
      updatedFavorites = favorites.filter(fav => fav.quote !== currentQuote.quote);
    } else {
      updatedFavorites = [...favorites, currentQuote];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
  };
  
  const isCurrentQuoteFavorite = () => {
    if (!currentQuote) return false;
    return favorites.some(fav => fav.quote === currentQuote.quote);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Daily Inspiration</CardTitle>
          <CardDescription className="text-purple-300/70">Motivational quotes to brighten your day</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {currentQuote && (
            <div className="mb-6 w-full max-w-2xl">
              <QuoteCard 
                quote={currentQuote.quote} 
                author={currentQuote.author} 
                tags={currentQuote.tags} 
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={getNewQuote}
              variant="outline" 
              className="bg-todo-gray/50 border-purple-500/20 text-purple-300 hover:bg-purple-900/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Quote
            </Button>
            
            <Button 
              onClick={toggleFavorite}
              variant={isCurrentQuoteFavorite() ? "default" : "outline"}
              className={isCurrentQuoteFavorite() 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-todo-gray/50 border-purple-500/20 text-purple-300 hover:bg-purple-900/20"}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              {isCurrentQuoteFavorite() ? "Favorited" : "Favorite"}
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-todo-gray/50 border-purple-500/20 text-purple-300 hover:bg-purple-900/20"
              onClick={() => {
                if (currentQuote) {
                  navigator.clipboard.writeText(`"${currentQuote.quote}" - ${currentQuote.author}`);
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {favorites.length > 0 && (
        <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Favorite Quotes</CardTitle>
            <CardDescription className="text-purple-300/70">Your collection of inspiring quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((fav, index) => (
                <QuoteCard key={index} quote={fav.quote} author={fav.author} tags={fav.tags} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
