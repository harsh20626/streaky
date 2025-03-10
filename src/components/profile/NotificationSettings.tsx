
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="text-purple-200">Email Notifications</Label>
          <Switch 
            id="email-notifications" 
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        <p className="text-xs text-purple-300/50">Receive updates and important information via email</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="task-reminders" className="text-purple-200">Task Reminders</Label>
          <Switch 
            id="task-reminders" 
            checked={taskReminders}
            onCheckedChange={setTaskReminders}
          />
        </div>
        <p className="text-xs text-purple-300/50">Get reminders about upcoming and overdue tasks</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="streak-alerts" className="text-purple-200">Streak Alerts</Label>
          <Switch 
            id="streak-alerts" 
            checked={streakAlerts}
            onCheckedChange={setStreakAlerts}
          />
        </div>
        <p className="text-xs text-purple-300/50">Receive alerts about your streak status</p>
      </div>
      
      <Button 
        onClick={handleSave}
        className="w-full mt-4 bg-todo-purple hover:bg-todo-purple/90"
      >
        Save Notification Settings
      </Button>
    </div>
  );
}
