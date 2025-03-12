
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Globe, Github } from "lucide-react";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  setActiveTab: (tab: string) => void;
}

export function LoginForm({ setActiveTab }: LoginFormProps) {
  const { login, loginWithGoogle, loginWithGithub, isLoading } = useFirebaseAuth();
  const [resetEmail, setResetEmail] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await login(data.email, data.password);
    } catch (err) {
      // Error is handled in the auth context
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err) {
      // Error is handled in the auth context
    }
  };
  
  const handleGithubLogin = async () => {
    try {
      setError(null);
      await loginWithGithub();
    } catch (err) {
      // Error is handled in the auth context
    }
  };
  
  const handleResetPassword = async () => {
    try {
      if (!resetEmail) {
        setError("Please enter your email address");
        return;
      }
      await useFirebaseAuth().resetPassword(resetEmail);
      setShowResetForm(false);
    } catch (err) {
      // Error is handled in the auth context
    }
  };
  
  const handleSignupClick = () => {
    // Find the signup tab element and click it safely
    const signupTab = document.querySelector('[data-tab="signup"]');
    if (signupTab && signupTab instanceof HTMLElement) {
      signupTab.click();
    } else {
      // Fallback if element not found
      setActiveTab('signup');
    }
  };
  
  return (
    <div className="space-y-6">
      {showResetForm ? (
        <div className="space-y-4">
          <h3 className="font-medium text-purple-200">Reset Password</h3>
          <Input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="bg-todo-gray/50"
          />
          {error && (
            <div className="bg-red-900/30 text-red-300 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowResetForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-todo-purple hover:bg-todo-purple/90"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              Send Reset Link
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-200">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      {...field} 
                      className="bg-todo-gray/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-200">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field}
                      className="bg-todo-gray/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="bg-red-900/30 text-red-300 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-todo-purple hover:bg-todo-purple/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            
            <Button
              type="button"
              variant="link"
              className="p-0 text-purple-300 hover:text-purple-200 text-sm w-full flex justify-end"
              onClick={() => setShowResetForm(true)}
            >
              Forgot password?
            </Button>
          </form>
        </Form>
      )}
      
      <div className="flex items-center">
        <Separator className="flex-1 bg-purple-500/10" />
        <span className="px-3 text-xs text-purple-300/50">OR</span>
        <Separator className="flex-1 bg-purple-500/10" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="bg-todo-gray/50"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Globe className="mr-2 h-4 w-4" />
          Google
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="bg-todo-gray/50"
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
      
      <div className="text-center text-sm">
        <span className="text-purple-300/70">Don't have an account? </span>
        <Button
          type="button"
          variant="link"
          className="p-0 text-purple-300 hover:text-purple-200"
          onClick={handleSignupClick}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
}
