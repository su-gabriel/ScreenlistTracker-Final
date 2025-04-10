import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Tv, 
  Home, 
  Search, 
  List, 
  TrendingUp, 
  LogOut,
  Menu,
  User
} from "lucide-react";
import PopularShows from "@/components/shows/popular-shows";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className="min-h-screen bg-background-light">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tv className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Screenlist</h1>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <Link href="/">
                  <div className="flex items-center space-x-1 text-gray-700 hover:text-primary cursor-pointer">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </div>
                </Link>
                <Link href="/search">
                  <div className="flex items-center space-x-1 text-gray-700 hover:text-primary cursor-pointer">
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </div>
                </Link>
                <Link href="/my-list">
                  <div className="flex items-center space-x-1 text-gray-700 hover:text-primary cursor-pointer">
                    <List className="h-4 w-4" />
                    <span>My List</span>
                  </div>
                </Link>
                <Link href="/insights">
                  <div className="flex items-center space-x-1 text-gray-700 hover:text-primary cursor-pointer">
                    <TrendingUp className="h-4 w-4" />
                    <span>Insights</span>
                  </div>
                </Link>
              </nav>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.username}</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </header>
      
      <main>
        {/* Hero section */}
        <div className="bg-gradient-to-r from-primary/10 to-background-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-6">
                Track and Discover Amazing TV Shows
              </h2>
              <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                Your personal TV show tracker and recommendation platform
              </p>
              <div className="mt-8">
                <Link href="/auth">
                  <Button size="lg">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Popular shows section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold mb-8">Popular Shows</h2>
          <PopularShows />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Screenlist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
