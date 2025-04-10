import { Link, useLocation } from "wouter";
import { Home, Bookmark, Search, Activity, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        <Link href="/">
          <a className={`flex flex-col items-center justify-center ${location === "/" ? "text-primary" : "text-gray-500 hover:text-primary"}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/my-list">
          <a className={`flex flex-col items-center justify-center ${location === "/my-list" ? "text-primary" : "text-gray-500 hover:text-primary"}`}>
            <Bookmark className="h-6 w-6" />
            <span className="text-xs mt-1">My List</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex flex-col items-center justify-center ${location === "/search" ? "text-primary" : "text-gray-500 hover:text-primary"}`}>
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        <Link href="/insights">
          <a className={`flex flex-col items-center justify-center ${location === "/insights" ? "text-primary" : "text-gray-500 hover:text-primary"}`}>
            <Activity className="h-6 w-6" />
            <span className="text-xs mt-1">Insights</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center justify-center ${location === "/profile" ? "text-primary" : "text-gray-500 hover:text-primary"}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
