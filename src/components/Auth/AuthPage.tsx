
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isInitialMount, setIsInitialMount] = useState(true);
  
  useEffect(() => {
    // To ensure the component mounts fully before any navigation
    setIsInitialMount(false);
  }, []);

  useEffect(() => {
    // Only redirect when it's not the initial mount and user is logged in
    if (!isInitialMount && user) {
      navigate("/");
    }
  }, [user, navigate, isInitialMount]);

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-todo-dark via-todo-dark to-purple-950/30">
      <div className="container flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            className="mb-8 flex items-center gap-1.5 text-purple-300"
            onClick={goBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Card className="bg-gradient-to-br from-todo-gray to-todo-dark border-purple-500/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-gradient-primary">Welcome to Streaky</CardTitle>
              <CardDescription className="text-purple-300/70">
                Your all-in-one productivity companion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 bg-todo-gray/80 backdrop-blur-sm border border-purple-500/10">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300"
                    data-tab="login"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-300"
                    data-tab="signup"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="focus-visible:outline-none">
                  <LoginForm setActiveTab={setActiveTab} />
                </TabsContent>
                
                <TabsContent value="signup" className="focus-visible:outline-none">
                  <SignupForm setActiveTab={setActiveTab} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
