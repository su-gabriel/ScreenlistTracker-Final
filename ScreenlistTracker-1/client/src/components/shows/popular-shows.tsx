import { useQuery } from "@tanstack/react-query";
import { TvShow } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Plus } from "lucide-react";

export default function PopularShows() {
  // Fetch popular TV shows from TMDB API
  const { data: popularShows, isLoading, error } = useQuery<TvShow[]>({
    queryKey: ["/api/popular-shows"],
  });
  
  // Shows loading state
  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Popular on TMDB</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse h-64">
              <div className="h-40 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  // Shows error state
  if (error) {
    console.error("Error loading popular shows:", error);
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Popular on TMDB</h2>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-500">Unable to load popular shows. Please try again later.</p>
        </div>
      </section>
    );
  }
  
  // Make sure popularShows is an array
  if (!popularShows || !Array.isArray(popularShows) || popularShows.length === 0) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Popular on TMDB</h2>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-600">No shows available at the moment.</p>
        </div>
      </section>
    );
  }
    
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Popular on TMDB</h2>
        <Button variant="link" className="text-primary">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularShows.slice(0, 8).map((show: TvShow) => (
          <div key={show.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-56 bg-gray-100">
              {show.imageUrl && (
                <img 
                  src={show.imageUrl} 
                  alt={show.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, replace with a placeholder
                    e.currentTarget.src = "https://via.placeholder.com/400x225?text=No+Image";
                  }}
                />
              )}
              {show.rating && (
                <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full flex items-center px-2 py-1">
                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                  <span className="text-xs font-medium">{(show.rating / 10).toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{show.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {show.year || show.genres?.slice(0, 1).join(', ') || 'TV Series'}
                </span>
                <Button variant="ghost" size="sm" className="text-xs h-8 p-0 px-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Watchlist
                </Button>
              </div>
              {show.description && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {show.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
