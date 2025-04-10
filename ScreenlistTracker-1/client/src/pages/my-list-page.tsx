import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { WatchlistEntry, WatchHistoryEntry, TvShow } from "@shared/schema";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import ShowCard from "@/components/shows/show-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, List, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function MyListPage() {
  const [activeTab, setActiveTab] = useState("watchlist");
  
  // Fetch watchlist, watch history, and TV shows
  const { data: watchlist, isLoading: watchlistLoading } = useQuery<WatchlistEntry[]>({
    queryKey: ["/api/watchlist"],
  });
  
  const { data: watchHistory, isLoading: historyLoading } = useQuery<WatchHistoryEntry[]>({
    queryKey: ["/api/watch-history"],
  });
  
  const { data: tvShows, isLoading: showsLoading } = useQuery<TvShow[]>({
    queryKey: ["/api/shows"],
  });
  
  const isLoading = watchlistLoading || historyLoading || showsLoading;
  
  // Filter and map the shows for watchlist
  const watchlistShows = watchlist && tvShows
    ? watchlist.map(entry => {
        const show = tvShows.find(s => s.id === entry.showId);
        return show;
      }).filter(Boolean) as TvShow[]
    : [];
  
  // Filter and map the shows for watch history, with progress
  const historyShows = watchHistory && tvShows
    ? watchHistory.map(entry => {
        const show = tvShows.find(s => s.id === entry.showId);
        return show ? { show, progress: entry.progress } : null;
      }).filter(Boolean).sort((a, b) => 
        // Sort by last watched date (most recent first)
        new Date(b!.show.id).getTime() - new Date(a!.show.id).getTime()
      )
    : [];
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background-light pb-16 md:pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-background-light pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My List</h1>
              <p className="text-gray-600">Manage your watchlist and track your watch history</p>
            </div>
            
            <Tabs defaultValue="watchlist" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="watchlist" className="flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  Watch Later
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center">
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Watch History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="watchlist">
                {watchlistShows.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Your watchlist is empty</h3>
                    <p className="text-gray-500 mb-4">Add shows to your watchlist to keep track of what you want to watch next.</p>
                    <Link href="/">
                      <Button>Discover shows</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {watchlistShows.map(show => (
                      <ShowCard 
                        key={show.id} 
                        show={show} 
                        isInWatchlist={true} 
                        type="recommendation" 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history">
                {historyShows.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Your watch history is empty</h3>
                    <p className="text-gray-500 mb-4">Shows you watch will appear here so you can track your progress.</p>
                    <Link href="/">
                      <Button>Start watching</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {historyShows.map(item => (
                      <ShowCard 
                        key={item?.show.id} 
                        show={item?.show!} 
                        progress={item?.progress} 
                        type="continue" 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
