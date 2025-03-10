
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface SignupFormProps {
  setActiveTab: (tab: string) => void;
}

export function SignupForm({ setActiveTab }: SignupFormProps) {
  const { signup, loginWithGoogle, loginWithGithub, loginWithMicrosoft, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await signup(data.email, data.password, data.name);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  
  const handleGithubLogin = async () => {
    try {
      setError(null);
      await loginWithGithub();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  
  const handleMicrosoftLogin = async () => {
    try {
      setError(null);
      await loginWithMicrosoft();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  
  const handleLoginClick = () => {
    // Find the login tab element and click it safely
    const loginTab = document.querySelector('[data-tab="login"]');
    if (loginTab && loginTab instanceof HTMLElement) {
      loginTab.click();
    } else {
      // Fallback if element not found
      setActiveTab('login');
    }
  };
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-200">Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your name" 
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
                <FormDescription className="text-purple-300/50 text-xs">
                  Must be at least 6 characters long
                </FormDescription>
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
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="flex items-center">
        <Separator className="flex-1 bg-purple-500/10" />
        <span className="px-3 text-xs text-purple-300/50">OR</span>
        <Separator className="flex-1 bg-purple-500/10" />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Button
          type="button"
          variant="outline"
          className="bg-todo-gray/50"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FaGoogle className="mr-2" />
          Google
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="bg-todo-gray/50"
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          <FaGithub className="mr-2" />
          GitHub
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="bg-todo-gray/50"
          onClick={handleMicrosoftLogin}
          disabled={isLoading}
        >
          <FaMicrosoft className="mr-2" />
          Microsoft
        </Button>
      </div>
      
      <div className="text-center text-sm">
        <span className="text-purple-300/70">Already have an account? </span>
        <Button
          type="button"
          variant="link"
          className="p-0 text-purple-300 hover:text-purple-200"
          onClick={handleLoginClick}
        >
          Log in
        </Button>
      </div>
    </div>
  );
}
