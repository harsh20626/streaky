
import { Navigate } from "react-router-dom";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useFirebaseAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-todo-purple"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  // If authenticated, show the protected content
  return <>{children}</>;
}
