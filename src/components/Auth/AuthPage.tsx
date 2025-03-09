
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect them
  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-todo-dark to-black">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-gradient mb-2">Streaky</h1>
        <p className="text-purple-300/70">Your personal productivity journey</p>
      </div>
      
      <div className="w-full max-w-md mb-6">
        <div className="flex rounded-lg overflow-hidden mb-6">
          <Button
            variant={activeTab === 'login' ? "default" : "outline"}
            className={`flex-1 rounded-none py-6 ${activeTab === 'login' ? 'bg-todo-purple hover:bg-todo-purple/90' : 'bg-todo-gray/50'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </Button>
          <Button
            variant={activeTab === 'signup' ? "default" : "outline"}
            className={`flex-1 rounded-none py-6 ${activeTab === 'signup' ? 'bg-todo-purple hover:bg-todo-purple/90' : 'bg-todo-gray/50'}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </Button>
        </div>

        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
      
      <p className="text-purple-300/50 text-sm mt-8 max-w-md text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
