
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { useTodo } from "@/contexts/TodoContext";
import { 
  User, Settings, Trophy, Star, Award, Palette, BookOpen,
  LogOut, Bell, ChevronRight, Lock, Globe, Upload,
  LayoutDashboard
} from "lucide-react";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { ThemeSettings } from "@/components/profile/ThemeSettings";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { analytics } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [showAchievements, setShowAchievements] = useState("All");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get registration date from user data or default to current date
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Handle section toggling
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Profile</CardTitle>
            <CardDescription className="text-purple-300/70">
              Log in to view and edit your profile
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

  const handleSaveProfile = () => {
    updateProfile({ name, email });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // For demo purposes, we'll just show a toast
        toast({
          title: "Image Uploaded",
          description: "Your profile picture would be updated in a real app.",
        });
      }
    };
    input.click();
  };

  const handleRemoveImage = () => {
    toast({
      title: "Image Removed",
      description: "Your profile picture has been removed.",
    });
  };
  
  const goToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gradient-primary">Your Profile</h1>
        <Button 
          variant="outline" 
          className="bg-todo-gray/50 flex items-center gap-2"
          onClick={goToDashboard}
        >
          <LayoutDashboard className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <UserAvatar size="lg" />
              </div>
              {isEditing ? (
                <>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="text-center font-bold bg-todo-gray/50 mb-2"
                  />
                  <Input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-center text-sm text-muted-foreground bg-todo-gray/50"
                    type="email"
                  />
                </>
              ) : (
                <>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  {isEditing ? (
                    <div className="space-x-2">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-todo-purple hover:bg-todo-purple/90"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="bg-todo-gray/50"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-between py-2 border-t border-border">
                  <span className="text-muted-foreground">Streak</span>
                  <span className="font-bold">{analytics.streakCount} days</span>
                </div>
                
                <div className="flex justify-between py-2 border-t border-border">
                  <span className="text-muted-foreground">Longest Streak</span>
                  <span className="font-bold">{analytics.longestStreak} days</span>
                </div>
                
                <div className="flex justify-between py-2 border-t border-border">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">{memberSince}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 bg-todo-gray/50"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.streakCount >= 3 ? (
                  <div className="glass-card rounded-lg p-3 flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-full">
                      <Star className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">First Streak</h3>
                      <p className="text-xs text-muted-foreground">Completed 3 days in a row</p>
                    </div>
                  </div>
                ) : null}
                
                {analytics.journalCount >= 5 ? (
                  <div className="glass-card rounded-lg p-3 flex items-center gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Journal Master</h3>
                      <p className="text-xs text-muted-foreground">Created 5 journal entries</p>
                    </div>
                  </div>
                ) : null}
                
                {analytics.completedTasks >= 10 ? (
                  <div className="glass-card rounded-lg p-3 flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-full">
                      <Award className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Task Master</h3>
                      <p className="text-xs text-muted-foreground">Completed 10 tasks</p>
                    </div>
                  </div>
                ) : null}
                
                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground"
                  onClick={() => navigate('/achievements')}
                >
                  View All Achievements
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3 space-y-6">
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="glass-card rounded-lg">
                  <div 
                    className="p-4 flex items-center justify-between border-b border-border cursor-pointer"
                    onClick={() => toggleSection('notifications')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-todo-gray/70 p-2 rounded-full">
                        <Bell className="h-5 w-5 text-todo-purple" />
                      </div>
                      <div>
                        <h3 className="font-medium">Notifications</h3>
                        <p className="text-xs text-muted-foreground">Manage how you receive alerts</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className={`h-5 w-5 transition-transform ${activeSection === 'notifications' ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>
                  
                  {activeSection === 'notifications' && (
                    <div className="p-4 bg-todo-gray/20">
                      <NotificationSettings />
                    </div>
                  )}
                  
                  <div 
                    className="p-4 flex items-center justify-between border-b border-border cursor-pointer"
                    onClick={() => toggleSection('theme')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-todo-gray/70 p-2 rounded-full">
                        <Palette className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Theme Settings</h3>
                        <p className="text-xs text-muted-foreground">Customize your experience</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className={`h-5 w-5 transition-transform ${activeSection === 'theme' ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>
                  
                  {activeSection === 'theme' && (
                    <div className="p-4 bg-todo-gray/20">
                      <ThemeSettings />
                    </div>
                  )}
                  
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('privacy')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-todo-gray/70 p-2 rounded-full">
                        <Lock className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Privacy & Security</h3>
                        <p className="text-xs text-muted-foreground">Manage your data and permissions</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className={`h-5 w-5 transition-transform ${activeSection === 'privacy' ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>
                  
                  {activeSection === 'privacy' && (
                    <div className="p-4 bg-todo-gray/20">
                      <PrivacySettings />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Profile Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="glass-card rounded-lg p-4">
                <h3 className="font-medium mb-3">Profile Picture</h3>
                <div className="flex items-center gap-4">
                  <UserAvatar size="lg" />
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="bg-todo-gray/50 w-full"
                      onClick={handleImageUpload}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-red-400 hover:text-red-300 w-full"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Privacy Settings</h3>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Profile Visibility</span>
                    </div>
                    <select 
                      className="bg-todo-gray/50 border border-border rounded px-2 py-1"
                      value={profileVisibility}
                      onChange={(e) => {
                        setProfileVisibility(e.target.value);
                        toast({
                          title: "Visibility Updated",
                          description: `Your profile is now ${e.target.value.toLowerCase()}.`,
                        });
                      }}
                    >
                      <option>Public</option>
                      <option>Friends Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span>Show Achievements</span>
                    </div>
                    <select 
                      className="bg-todo-gray/50 border border-border rounded px-2 py-1"
                      value={showAchievements}
                      onChange={(e) => {
                        setShowAchievements(e.target.value);
                        toast({
                          title: "Achievement Display Updated",
                          description: `Now showing ${e.target.value.toLowerCase()} achievements.`,
                        });
                      }}
                    >
                      <option>All</option>
                      <option>Selected</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.streakCount > 0 && (
                  <div className="glass-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="bg-yellow-500/20 p-3 rounded-full mb-3">
                      <Star className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="font-medium">Active User</h3>
                    <p className="text-xs text-muted-foreground mt-1">Started your productivity journey</p>
                  </div>
                )}
                
                {analytics.completedTasks >= 10 && (
                  <div className="glass-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="bg-purple-500/20 p-3 rounded-full mb-3">
                      <Award className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="font-medium">Task Master</h3>
                    <p className="text-xs text-muted-foreground mt-1">Completed 10+ tasks</p>
                  </div>
                )}
                
                {!analytics.completedTasks && !analytics.streakCount && (
                  <div className="col-span-full text-center py-6 text-muted-foreground">
                    <p>Complete tasks and maintain streaks to earn badges!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
