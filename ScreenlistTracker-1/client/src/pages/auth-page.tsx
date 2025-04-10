import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Tv } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { InsertUser } from "@shared/schema";

// For debugging in console
console.log("Auth page loaded!");

export default function AuthPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Form fields
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });
  
  const [registerFormData, setRegisterFormData] = useState<InsertUser>({
    username: "",
    password: "",
    name: "",
    email: "",
  });
  
  // Get auth context and navigation
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Handle login form input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };
  
  // Handle register form input changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };
  
  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginFormData.username || !loginFormData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await loginMutation.mutateAsync(loginFormData);
    } catch (error) {
      // Error is handled in the mutation callbacks
    }
  };
  
  // Handle register submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerFormData.username || !registerFormData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Confirm password validation
    const formElement = e.target as HTMLFormElement;
    const confirmPasswordInput = formElement.querySelector("[name='confirmPassword']") as HTMLInputElement;
    
    if (confirmPasswordInput && confirmPasswordInput.value !== registerFormData.password) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await registerMutation.mutateAsync(registerFormData);
    } catch (error) {
      // Error is handled in the mutation callbacks
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Tv className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to Screenlist
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your personal TV show tracker and recommendation platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Input 
                    id="username" 
                    name="username" 
                    type="text" 
                    placeholder="johndoe" 
                    required 
                    value={loginFormData.username}
                    onChange={handleLoginChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="********" 
                    required 
                    value={loginFormData.password}
                    onChange={handleLoginChange}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">Don't have an account?</span>{" "}
                <Button variant="link" onClick={() => setActiveTab("register")} className="p-0">
                  Register now
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Input 
                    id="reg-username" 
                    name="username" 
                    type="text" 
                    placeholder="johndoe" 
                    required 
                    value={registerFormData.username}
                    onChange={handleRegisterChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    value={registerFormData.name || ""}
                    onChange={handleRegisterChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={registerFormData.email || ""}
                    onChange={handleRegisterChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input 
                    id="reg-password" 
                    name="password" 
                    type="password" 
                    placeholder="********" 
                    required 
                    value={registerFormData.password}
                    onChange={handleRegisterChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    placeholder="********" 
                    required 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">Already have an account?</span>{" "}
                <Button variant="link" onClick={() => setActiveTab("login")} className="p-0">
                  Login instead
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
