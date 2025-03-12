
import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { User as AppUser } from '@/types/todo';

interface FirebaseAuthContextProps {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<User>;
  loginWithGithub: () => Promise<User>;
  loginWithMicrosoft: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  // Utility functions to convert Firebase User to our AppUser format
  getUserProfile: () => AppUser | null;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextProps | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email: string, password: string, name: string): Promise<User> => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (auth.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: name
        });
      }
      
      toast.success("Account created successfully!");
      return userCredential.user;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      return userCredential.user;
    } catch (error: any) {
      let errorMessage = "Failed to log in";
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Try again later";
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
      throw error;
    }
  };

  // Google Sign In
  const loginWithGoogle = async (): Promise<User> => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      toast.success("Logged in with Google successfully!");
      return result.user;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to log in with Google";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // GitHub Sign In
  const loginWithGithub = async (): Promise<User> => {
    try {
      setIsLoading(true);
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      toast.success("Logged in with GitHub successfully!");
      return result.user;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to log in with GitHub";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Microsoft Sign In
  const loginWithMicrosoft = async (): Promise<User> => {
    try {
      setIsLoading(true);
      const provider = new OAuthProvider('microsoft.com');
      const result = await signInWithPopup(auth, provider);
      toast.success("Logged in with Microsoft successfully!");
      return result.user;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to log in with Microsoft";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send password reset email";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update profile
  const updateUserProfile = async (displayName?: string, photoURL?: string): Promise<void> => {
    try {
      if (!auth.currentUser) throw new Error("No user is logged in");
      
      const updates: { displayName?: string; photoURL?: string } = {};
      if (displayName) updates.displayName = displayName;
      if (photoURL) updates.photoURL = photoURL;
      
      await firebaseUpdateProfile(auth.currentUser, updates);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update profile";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update email
  const updateUserEmail = async (email: string): Promise<void> => {
    try {
      if (!auth.currentUser) throw new Error("No user is logged in");
      await updateEmail(auth.currentUser, email);
      toast.success("Email updated successfully!");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update email";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update password
  const updateUserPassword = async (password: string): Promise<void> => {
    try {
      if (!auth.currentUser) throw new Error("No user is logged in");
      await updatePassword(auth.currentUser, password);
      toast.success("Password updated successfully!");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update password";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Convert Firebase User to AppUser
  const getUserProfile = (): AppUser | null => {
    if (!currentUser) return null;
    
    return {
      id: currentUser.uid,
      name: currentUser.displayName || 'User',
      email: currentUser.email || '',
      profilePicture: currentUser.photoURL || '/placeholder.svg',
      createdAt: currentUser.metadata.creationTime || new Date().toISOString(),
      bio: '',
      settings: {
        theme: 'dark',
        notifications: true,
        privacy: 'public'
      }
    };
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithGithub,
    loginWithMicrosoft,
    resetPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    getUserProfile
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
