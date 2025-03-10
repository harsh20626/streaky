
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeSettings() {
  const [theme, setTheme] = useState("dark");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Theme Settings Saved",
      description: `Theme has been updated to ${theme} mode.`,
    });
  };

  return (
    <div className="space-y-6">
      <RadioGroup value={theme} onValueChange={setTheme} className="space-y-4">
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-todo-gray/30 transition-colors">
          <RadioGroupItem value="light" id="theme-light" />
          <Label htmlFor="theme-light" className="flex items-center gap-2 cursor-pointer">
            <Sun className="h-5 w-5 text-yellow-400" />
            Light Mode
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-todo-gray/30 transition-colors">
          <RadioGroupItem value="dark" id="theme-dark" />
          <Label htmlFor="theme-dark" className="flex items-center gap-2 cursor-pointer">
            <Moon className="h-5 w-5 text-blue-400" />
            Dark Mode
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-todo-gray/30 transition-colors">
          <RadioGroupItem value="system" id="theme-system" />
          <Label htmlFor="theme-system" className="flex items-center gap-2 cursor-pointer">
            <Monitor className="h-5 w-5 text-purple-400" />
            System Default
          </Label>
        </div>
      </RadioGroup>
      
      <div className="pt-2">
        <Button 
          onClick={handleSave} 
          className="w-full bg-todo-purple hover:bg-todo-purple/90"
        >
          Save Theme Settings
        </Button>
      </div>
    </div>
  );
}
