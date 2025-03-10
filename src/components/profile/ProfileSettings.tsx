
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const { toast } = useToast();

  const handleSave = () => {
    updateProfile({ name, bio });
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profile-name" className="text-purple-200">Name</Label>
        <Input 
          id="profile-name"
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="bg-todo-gray/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profile-bio" className="text-purple-200">Bio</Label>
        <textarea
          id="profile-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full h-24 rounded-md bg-todo-gray/50 border border-input px-3 py-2 text-sm"
          placeholder="Tell us about yourself"
        />
      </div>
      
      <Button 
        onClick={handleSave}
        className="w-full bg-todo-purple hover:bg-todo-purple/90"
      >
        Save Profile Settings
      </Button>
    </div>
  );
}
