import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  
  console.log("Protected route state:", { user, isLoading });
  
  // Redirect to login if not authenticated and not still loading
  if (!isLoading && !user) {
    console.log("Redirecting to auth page because user is not authenticated");
    return <Redirect to="/auth" />;
  }
  
  // Render the protected content (we'll show a loading state where needed in the components)
  return <>{children}</>;
}