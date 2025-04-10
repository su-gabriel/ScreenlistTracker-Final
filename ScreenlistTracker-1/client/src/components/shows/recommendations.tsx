import { TvShow, WatchlistEntry } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import ShowCard from "./show-card";
import { Button } from "@/components/ui/button";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";

export default function Recommendations() {
  // Fetch TV shows and watchlist
  const { data: tvShows, isLoading: showsLoading } = useQuery<TvShow[]>({
    queryKey: ["/api/shows"],
  });
  
  const { data: watchlist, isLoading: watchlistLoading } = useQuery<WatchlistEntry[]>({
    queryKey: ["/api/watchlist"],
  });
  
  const isLoading = showsLoading || watchlistLoading;
  
  // Get recommended shows
  const recommendedShows = tvShows 
    ? tvShows
        .sort(() => 0.5 - Math.random()) // Randomly shuffle for demo purposes
        .slice(0, 4)
    : [];
  
  // Check if a show is in the watchlist
  const isInWatchlist = (showId: number): boolean => {
    if (!watchlist) return false;
    return watchlist.some(entry => entry.showId === showId);
  };
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recommended For You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
              <div className="bg-gray-200 h-40 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recommended For You</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="p-1 rounded text-gray-500 hover:text-primary hover:bg-gray-100">
            <SlidersHorizontal className="h-6 w-6" />
          </Button>
          <Link href="/recommendations">
            <Button variant="link" className="text-primary">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {recommendedShows.map(show => (
          <ShowCard 
            key={show.id} 
            show={show} 
            isInWatchlist={isInWatchlist(show.id)} 
            type="recommendation" 
          />
        ))}
      </div>
    </section>
  );
}
