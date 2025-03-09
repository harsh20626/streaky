
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Star, Target, Zap, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTodo } from "@/contexts/TodoContext";
import { useState, useEffect } from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: "beginner" | "intermediate" | "advanced" | "special";
}

export function Achievements() {
  const { todos } = useTodo();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Calculate achievements based on todos
  useEffect(() => {
    const completedTasks = todos.filter(todo => todo.completed).length;
    const totalTasks = todos.length;
    const streakDays = 5; // This would come from a streak tracking system
    
    const updatedAchievements: Achievement[] = [
      {
        id: "first-task",
        name: "First Step",
        description: "Complete your first task",
        icon: <Trophy className="h-8 w-8 text-amber-400" />,
        progress: completedTasks > 0 ? 1 : 0,
        maxProgress: 1,
        unlocked: completedTasks > 0,
        category: "beginner"
      },
      {
        id: "five-tasks",
        name: "High Five",
        description: "Complete 5 tasks",
        icon: <Award className="h-8 w-8 text-blue-400" />,
        progress: Math.min(completedTasks, 5),
        maxProgress: 5,
        unlocked: completedTasks >= 5,
        category: "beginner"
      },
      {
        id: "twenty-tasks",
        name: "Task Master",
        description: "Complete 20 tasks",
        icon: <Star className="h-8 w-8 text-purple-400" />,
        progress: Math.min(completedTasks, 20),
        maxProgress: 20,
        unlocked: completedTasks >= 20,
        category: "intermediate"
      },
      {
        id: "three-day-streak",
        name: "On Fire",
        description: "Maintain a 3-day streak",
        icon: <Flame className="h-8 w-8 text-orange-500" />,
        progress: Math.min(streakDays, 3),
        maxProgress: 3,
        unlocked: streakDays >= 3,
        category: "intermediate"
      },
      {
        id: "seven-day-streak",
        name: "Unstoppable",
        description: "Maintain a 7-day streak",
        icon: <Zap className="h-8 w-8 text-yellow-400" />,
        progress: Math.min(streakDays, 7),
        maxProgress: 7,
        unlocked: streakDays >= 7,
        category: "advanced"
      },
      {
        id: "journal-master",
        name: "Self Reflector",
        description: "Write 10 journal entries",
        icon: <Target className="h-8 w-8 text-green-400" />,
        progress: 2, // This would come from journal entries count
        maxProgress: 10,
        unlocked: false,
        category: "advanced"
      }
    ];
    
    setAchievements(updatedAchievements);
  }, [todos]);

  // Group achievements by category
  const beginnerAchievements = achievements.filter(a => a.category === "beginner");
  const intermediateAchievements = achievements.filter(a => a.category === "intermediate");
  const advancedAchievements = achievements.filter(a => a.category === "advanced");
  const specialAchievements = achievements.filter(a => a.category === "special");

  const renderAchievement = (achievement: Achievement) => (
    <Card 
      key={achievement.id} 
      className={`bg-todo-gray/30 border-purple-500/10 ${achievement.unlocked ? 'border-amber-500/50' : ''}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-amber-500/20' : 'bg-gray-700/30'}`}>
            {achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-lg text-white">{achievement.name}</h3>
              {achievement.unlocked && (
                <Badge className="bg-amber-500/80 text-black">Unlocked</Badge>
              )}
            </div>
            <p className="text-purple-300/70 text-sm">{achievement.description}</p>
            <div className="mt-2">
              <Progress 
                value={(achievement.progress / achievement.maxProgress) * 100} 
                className={`h-2 ${achievement.unlocked ? 'bg-amber-500/30' : 'bg-gray-700/30'}`}
              />
              <p className="text-xs text-right mt-1 text-purple-300/50">
                {achievement.progress}/{achievement.maxProgress}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gradient-primary mb-2">Your Achievements</h1>
        <p className="text-purple-300/70">Track your progress and earn rewards as you use Streaky</p>
      </div>
      
      <div className="space-y-8">
        {beginnerAchievements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beginnerAchievements.map(renderAchievement)}
            </div>
          </div>
        )}
        
        {intermediateAchievements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Consistency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intermediateAchievements.map(renderAchievement)}
            </div>
          </div>
        )}
        
        {advancedAchievements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Expert</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advancedAchievements.map(renderAchievement)}
            </div>
          </div>
        )}
        
        {specialAchievements.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Special</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialAchievements.map(renderAchievement)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
