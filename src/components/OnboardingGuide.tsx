
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "Welcome to Streaky!",
    description: "Your new productivity companion that helps you track daily habits and tasks.",
    image: "📊"
  },
  {
    title: "Dashboard",
    description: "View your productivity stats at a glance and track your progress over time.",
    image: "📈"
  },
  {
    title: "Todo List",
    description: "Create and manage your tasks, set priorities and mark them as completed.",
    image: "✅"
  },
  {
    title: "Daily Essentials",
    description: "Track your recurring daily habits and build consistency over time.",
    image: "🔄"
  },
  {
    title: "Focus Timer",
    description: "Use the Pomodoro technique to stay focused and productive.",
    image: "⏱️"
  },
  {
    title: "Journal",
    description: "Reflect on your day and track your thoughts and progress.",
    image: "📝"
  }
];

export function OnboardingGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md"
        >
          <Card className="border-white/10 bg-sidebar shadow-xl">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <span className="text-5xl">{steps[currentStep].image}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{steps[currentStep].title}</h2>
                  <p className="text-white/80 mb-6">{steps[currentStep].description}</p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                <div className="flex gap-1.5">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-6 rounded-full ${
                        index === currentStep ? "bg-white" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  size="sm"
                  onClick={handleNext}
                >
                  {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
