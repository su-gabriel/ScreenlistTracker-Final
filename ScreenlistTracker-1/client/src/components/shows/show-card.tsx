import { TvShow, StreamingService } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PlayCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { addToWatchlist, removeFromWatchlist } from "@/lib/tvshows";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface ShowCardProps {
  show: TvShow;
  progress?: number;
  isInWatchlist?: boolean;
  type?: "continue" | "recommendation";
}

export default function ShowCard({ show, progress, isInWatchlist = false, type = "recommendation" }: ShowCardProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  
  const { data: streamingServices } = useQuery<StreamingService[]>({
    queryKey: ["/api/streaming-services"],
  });
  
  // Get the streaming service for this show
  const streamingService = streamingServices?.find(s => s.id === show.streamingServiceId);
  
  // Add to watchlist mutation
  const addToWatchlistMutation = useMutation({
    mutationFn: () => addToWatchlist(show.id),
    onMutate: () => {
      setIsAdding(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to watchlist",
        description: `${show.title} has been added to your watchlist.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add to watchlist",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsAdding(false);
    },
  });
  
  // Remove from watchlist mutation
  const removeFromWatchlistMutation = useMutation({
    mutationFn: () => removeFromWatchlist(show.id),
    onMutate: () => {
      setIsAdding(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed from watchlist",
        description: `${show.title} has been removed from your watchlist.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove from watchlist",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsAdding(false);
    },
  });
  
  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlistMutation.mutate();
    } else {
      addToWatchlistMutation.mutate();
    }
  };
  
  if (type === "continue") {
    return (
      <div className="show-card bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md">
        <div className="relative">
          <img 
            src={show.imageUrl} 
            className="w-full h-40 object-cover" 
            alt={show.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-3 text-white">
            <div className="font-medium">{show.title}</div>
            <div className="text-xs">S{Math.floor(Math.random() * 5) + 1} E{Math.floor(Math.random() * 12) + 1}</div>
          </div>
          <div className="absolute top-0 right-0 p-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                  style={{ backgroundColor: `${streamingService?.color}20`, color: streamingService?.color }}>
              {streamingService?.name || 'Unknown'}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-200">
            <div className="h-full bg-primary" style={{width: `${progress || 0}%`}}></div>
          </div>
        </div>
        <div className="p-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">{progress || 0}% completed</div>
          <button className="p-1 rounded-full text-primary hover:bg-blue-50">
            <PlayCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }
  
  // Recommendation card type
  return (
    <div className="show-card bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <img 
          src={show.imageUrl} 
          className="w-full h-40 object-cover" 
          alt={show.title} 
        />
        <div className="absolute top-0 right-0 p-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                style={{ backgroundColor: `${streamingService?.color}20`, color: streamingService?.color }}>
            {streamingService?.name || 'Unknown'}
          </span>
        </div>
        <div className="absolute top-0 left-0 p-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {Math.floor(70 + Math.random() * 25)}% Match
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{show.title}</h3>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <span>{show.year}</span>
          <span className="mx-1">•</span>
          <span>{show.seasons} Season{show.seasons !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {Array(5).fill(0).map((_, i) => (
              <svg 
                key={i}
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${i < Math.floor(show.rating! / 10) ? '' : 'text-gray-300'}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-600">{(show.rating! / 10).toFixed(1)}/5</span>
        </div>
        <div className="flex space-x-2 mt-3">
          <Button
            onClick={handleWatchlistToggle}
            disabled={addToWatchlistMutation.isPending || removeFromWatchlistMutation.isPending}
            className={`flex-1 py-1.5 text-sm ${isInWatchlist ? 'bg-green-600' : 'bg-primary'}`}
          >
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Button>
          <Button variant="outline" size="icon" className="p-1.5 bg-gray-100 hover:bg-gray-200">
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
