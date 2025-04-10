import { TvShow, WatchHistoryEntry } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import ShowCard from "./show-card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function ContinueWatching() {
  // Fetch watch history and TV shows
  const { data: watchHistory, isLoading: historyLoading } = useQuery<WatchHistoryEntry[]>({
    queryKey: ["/api/watch-history"],
  });
  
  const { data: tvShows, isLoading: showsLoading } = useQuery<TvShow[]>({
    queryKey: ["/api/shows"],
  });
  
  const isLoading = historyLoading || showsLoading;
  
  // Get shows from watch history
  const continueWatchingShows = watchHistory && tvShows 
    ? watchHistory
        .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
        .slice(0, 4)
        .map(entry => {
          const show = tvShows.find(s => s.id === entry.showId);
          return { show, progress: entry.progress };
        })
        .filter(({ show }) => show !== undefined)
    : [];
  
  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Continue Watching</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-64 animate-pulse">
              <div className="bg-gray-200 h-40 rounded-t-lg"></div>
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
  
  if (continueWatchingShows.length === 0) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Continue Watching</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No shows in progress</h3>
          <p className="text-gray-500 mb-4">Start watching a show to see it here.</p>
          <Link href="/recommendations">
            <Button>Find something to watch</Button>
          </Link>
        </div>
      </section>
    );
  }
  
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Continue Watching</h2>
        <Link href="/my-list">
          <Button variant="link" className="text-primary">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {continueWatchingShows.map(({ show, progress }) => (
          show && <ShowCard key={show.id} show={show} progress={progress} type="continue" />
        ))}
      </div>
    </section>
  );
}
