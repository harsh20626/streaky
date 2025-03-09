
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trophy, Star, Users, MessageSquare, Search } from "lucide-react";

export default function Community() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Join the Community</CardTitle>
            <CardDescription className="text-purple-300/70">
              Log in to connect with other Streaky users
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button className="bg-todo-purple hover:bg-todo-purple/90">
              Log In to Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-2/3 space-y-6">
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gradient-primary">Community Challenges</CardTitle>
                <Button variant="outline" className="bg-todo-gray/50 text-white">
                  Join Challenge
                </Button>
              </div>
              <CardDescription className="text-purple-300/70">Participate with others in timed challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <div>
                        <h3 className="font-medium">30 Days of Journaling</h3>
                        <p className="text-sm text-muted-foreground">20 participants</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">Trending</Badge>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">18 days remaining</p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-todo-purple" />
                      <div>
                        <h3 className="font-medium">Productivity Sprint</h3>
                        <p className="text-sm text-muted-foreground">42 participants</p>
                      </div>
                    </div>
                    <Badge className="bg-todo-purple/20 text-todo-purple border-todo-purple">Popular</Badge>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-todo-purple" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">7 days remaining</p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-blue-400" />
                      <div>
                        <h3 className="font-medium">Mindfulness Master</h3>
                        <p className="text-sm text-muted-foreground">15 participants</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">New</Badge>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-blue-400" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">2 days remaining</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Community Feed</CardTitle>
              <CardDescription className="text-purple-300/70">Recent achievements and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <UserAvatar name={`User ${i}`} />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">User {i}</h3>
                          <span className="text-xs text-muted-foreground">2h ago</span>
                        </div>
                        <p className="text-sm mt-1">Completed a 7-day streak in the Productivity Sprint challenge!</p>
                        <div className="flex items-center gap-3 mt-3">
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <Star className="h-4 w-4" />
                            <span>12</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>3</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3 space-y-6">
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                Leaderboard
              </CardTitle>
              <CardDescription className="text-purple-300/70">Top streak maintainers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`${rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-700' : 'text-muted-foreground'} font-medium`}>
                        {rank}
                      </span>
                      <UserAvatar name={`User ${rank}`} />
                      <span className="font-medium">User {rank}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold">{Math.floor(Math.random() * 40) + 10}</span>
                      <span className="text-xs text-muted-foreground ml-1">days</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Find Users
              </CardTitle>
              <CardDescription className="text-purple-300/70">Connect with other Streaky users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 bg-todo-gray/50" placeholder="Search by name or email" />
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={`User ${i + 5}`} />
                      <div>
                        <h3 className="font-medium">User {i + 5}</h3>
                        <p className="text-xs text-muted-foreground">12 day streak</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 bg-todo-gray/50">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
