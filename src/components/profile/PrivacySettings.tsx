
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PrivacySettings() {
  const [dataSaving, setDataSaving] = useState(true);
  const [activityTracking, setActivityTracking] = useState(true);
  const [analyticsSharing, setAnalyticsSharing] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Privacy Settings Saved",
      description: "Your privacy preferences have been updated.",
    });
  };
  
  const handleDeleteData = () => {
    toast({
      title: "Request Submitted",
      description: "Your request to delete account data has been submitted.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="data-saving" className="text-purple-200">Save Usage Data</Label>
          <Switch 
            id="data-saving" 
            checked={dataSaving}
            onCheckedChange={setDataSaving}
          />
        </div>
        <p className="text-xs text-purple-300/50">Store data about how you use the app to improve your experience</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="activity-tracking" className="text-purple-200">Track Activity</Label>
          <Switch 
            id="activity-tracking" 
            checked={activityTracking}
            onCheckedChange={setActivityTracking}
          />
        </div>
        <p className="text-xs text-purple-300/50">Track your activity to provide better recommendations</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="analytics-sharing" className="text-purple-200">Share Analytics</Label>
          <Switch 
            id="analytics-sharing" 
            checked={analyticsSharing}
            onCheckedChange={setAnalyticsSharing}
          />
        </div>
        <p className="text-xs text-purple-300/50">Share anonymous usage data to help improve the app</p>
      </div>
      
      <div className="pt-2 space-y-2">
        <Button 
          onClick={handleSave}
          className="w-full bg-todo-purple hover:bg-todo-purple/90"
        >
          Save Privacy Settings
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10"
          onClick={handleDeleteData}
        >
          Request Data Deletion
        </Button>
      </div>
    </div>
  );
}
