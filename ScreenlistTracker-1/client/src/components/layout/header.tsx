import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Search, Menu, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/auth");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6ZM4 6V18H20V6H4Z" />
              <path d="M9.5 9C9.5 8.17157 10.1716 7.5 11 7.5H13C13.8284 7.5 14.5 8.17157 14.5 9V15C14.5 15.8284 13.8284 16.5 13 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15V9Z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-primary">Screenlist</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search TV shows..."
              className="py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </form>
          
          {user && (
            <div className="flex items-center space-x-3">
              <Link href="/notifications">
                <button className="text-sm text-gray-700 hover:text-primary">
                  <Bell className="h-6 w-6" />
                </button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || ""} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
          <form onSubmit={handleSearch} className="mb-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search TV shows..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>
          </form>
          
          <div className="space-y-2">
            <Link href="/" className="block py-2 text-base font-medium text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link href="/my-list" className="block py-2 text-base font-medium text-gray-700 hover:text-primary">
              My List
            </Link>
            <Link href="/insights" className="block py-2 text-base font-medium text-gray-700 hover:text-primary">
              Insights
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 text-base font-medium text-gray-700 hover:text-primary"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
