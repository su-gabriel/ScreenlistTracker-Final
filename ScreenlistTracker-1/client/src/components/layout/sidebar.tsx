import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Home, Bookmark, TrendingUp, Activity, Users, Plus } from "lucide-react";
import { useMemo } from "react";
import { StreamingService, Genre } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function Sidebar() {
  const [location] = useLocation();
  
  const { data: streamingServices } = useQuery<StreamingService[]>({
    queryKey: ["/api/streaming-services"],
  });
  
  const { data: genres } = useQuery<Genre[]>({
    queryKey: ["/api/genres"],
  });
  
  const { data: userPreferences } = useQuery({
    queryKey: ["/api/user-preferences"],
  });
  
  const favoriteGenres = useMemo(() => {
    if (!genres || !userPreferences?.favoriteGenres) return [];
    return userPreferences.favoriteGenres
      .map(id => genres.find(g => g.id === id))
      .filter(Boolean) as Genre[];
  }, [genres, userPreferences]);
  
  const userServices = useMemo(() => {
    if (!streamingServices || !userPreferences?.streamingServices) return [];
    return userPreferences.streamingServices
      .map(id => streamingServices.find(s => s.id === id))
      .filter(Boolean) as StreamingService[];
  }, [streamingServices, userPreferences]);

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="px-4 py-6 space-y-8">
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</h3>
          <div className="mt-2 space-y-1">
            <Link href="/">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${location === "/" ? "text-primary bg-blue-50 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"}`}>
                <Home className="h-5 w-5 mr-2 text-gray-500" />
                Home
              </a>
            </Link>
            <Link href="/my-list">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${location === "/my-list" ? "text-primary bg-blue-50 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"}`}>
                <Bookmark className="h-5 w-5 mr-2 text-gray-500" />
                My List
              </a>
            </Link>
            <Link href="/recommendations">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${location === "/recommendations" ? "text-primary bg-blue-50 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"}`}>
                <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                Recommendations
              </a>
            </Link>
            <Link href="/insights">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${location === "/insights" ? "text-primary bg-blue-50 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"}`}>
                <Activity className="h-5 w-5 mr-2 text-gray-500" />
                Insights
              </a>
            </Link>
            <Link href="/friends">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${location === "/friends" ? "text-primary bg-blue-50 hover:bg-blue-100" : "text-gray-700 hover:bg-gray-100"}`}>
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                Friends
              </a>
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">My Streaming Services</h3>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {userServices.map((service) => (
              <div
                key={service.id}
                className="platform-icon bg-blue-100 rounded-md p-2 flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: `${service.color}20` }}
              >
                <svg className={`h-6 w-6 text-[${service.color}]`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm2 2h10v10H7V7zm2 2v6h6V9H9z"/>
                </svg>
              </div>
            ))}
            <Link href="/streaming-services">
              <a className="platform-icon bg-gray-100 rounded-md p-2 flex items-center justify-center cursor-pointer">
                <Plus className="h-6 w-6 text-gray-500" />
              </a>
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorite Genres</h3>
          <div className="mt-2 space-y-1 px-3">
            <div className="flex flex-wrap gap-2">
              {favoriteGenres.map((genre) => (
                <Badge key={genre.id} variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {genre.name}
                </Badge>
              ))}
            </div>
            <Link href="/genres">
              <a className="text-xs text-primary hover:underline mt-2 inline-block">
                Edit genres →
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
