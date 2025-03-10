import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types/todo';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (email: string, password: string, name: string) => Promise<User | null>;
  logout: () => void;
  updateProfile: (updateData: Partial<User>) => void;
  loginWithGoogle: () => Promise<User | null>;
  loginWithGithub: () => Promise<User | null>;
  loginWithMicrosoft: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user for login
      const demoUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        profilePicture: '/placeholder.svg',
        createdAt: new Date().toISOString(),
        bio: 'I love using Streaky to stay productive!',
        settings: {
          theme: 'dark',
          notifications: true,
          privacy: 'public'
        }
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      setIsLoading(false);
      return demoUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user
      const newUser: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
        profilePicture: '/placeholder.svg',
        createdAt: new Date().toISOString(),
        bio: '',
        settings: {
          theme: 'dark',
          notifications: true,
          privacy: 'public'
        }
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsLoading(false);
      return newUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updateData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updateData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // Social login functions
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo Google user
      const googleUser: User = {
        id: 'google-1',
        name: 'Google User',
        email: 'google@example.com',
        profilePicture: '/placeholder.svg',
        createdAt: new Date().toISOString(),
        bio: 'Joined via Google',
        settings: {
          theme: 'dark',
          notifications: true,
          privacy: 'public'
        }
      };
      
      localStorage.setItem('user', JSON.stringify(googleUser));
      setUser(googleUser);
      setIsLoading(false);
      return googleUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo GitHub user
      const githubUser: User = {
        id: 'github-1',
        name: 'GitHub User',
        email: 'github@example.com',
        profilePicture: '/placeholder.svg',
        createdAt: new Date().toISOString(),
        bio: 'Joined via GitHub',
        settings: {
          theme: 'dark',
          notifications: true,
          privacy: 'public'
        }
      };
      
      localStorage.setItem('user', JSON.stringify(githubUser));
      setUser(githubUser);
      setIsLoading(false);
      return githubUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithMicrosoft = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo Microsoft user
      const microsoftUser: User = {
        id: 'microsoft-1',
        name: 'Microsoft User',
        email: 'microsoft@example.com',
        profilePicture: '/placeholder.svg',
        createdAt: new Date().toISOString(),
        bio: 'Joined via Microsoft',
        settings: {
          theme: 'dark',
          notifications: true,
          privacy: 'public'
        }
      };
      
      localStorage.setItem('user', JSON.stringify(microsoftUser));
      setUser(microsoftUser);
      setIsLoading(false);
      return microsoftUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Value to be provided by the context
  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
    updateProfile,
    loginWithGoogle,
    loginWithGithub,
    loginWithMicrosoft
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
