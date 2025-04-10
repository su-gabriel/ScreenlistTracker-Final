import { useQuery, useMutation } from "@tanstack/react-query";
import { Genre } from "@shared/schema";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { saveUserPreferences } from "@/lib/tvshows";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GenreSelectProps {
  onComplete: () => void;
  preferenceData: {
    streamingServices: number[];
    favoriteGenres: number[];
  } | null;
  setPreferenceData: React.Dispatch<React.SetStateAction<{
    streamingServices: number[];
    favoriteGenres: number[];
  } | null>>;
}

export default function GenreSelect({ onComplete, preferenceData, setPreferenceData }: GenreSelectProps) {
  const { toast } = useToast();
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  
  // Fetch genres
  const { data: genres, isLoading } = useQuery<Genre[]>({
    queryKey: ["/api/genres"],
  });
  
  // Save preferences mutation
  const saveMutation = useMutation({
    mutationFn: saveUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-preferences"] });
      toast({
        title: "Preferences saved",
        description: "Your favorite genres have been updated.",
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Failed to save preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Initialize selected genres from existing preferences
  useEffect(() => {
    if (preferenceData?.favoriteGenres) {
      setSelectedGenres(preferenceData.favoriteGenres);
    }
  }, [preferenceData]);
  
  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };
  
  const handleSave = () => {
    if (!preferenceData?.streamingServices || !preferenceData.streamingServices.length) {
      toast({
        title: "Missing information",
        description: "Please select your streaming services first.",
        variant: "destructive",
      });
      return;
    }
    
    // Update preference data in parent component
    setPreferenceData(prev => ({
      streamingServices: prev?.streamingServices || [],
      favoriteGenres: selectedGenres
    }));
    
    // Save to API
    saveMutation.mutate({
      streamingServices: preferenceData.streamingServices,
      favoriteGenres: selectedGenres
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Select Your Favorite Genres</h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose the genres you enjoy watching the most to get personalized recommendations.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {genres?.map(genre => (
          <Badge
            key={genre.id}
            variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
            className={`
              cursor-pointer text-sm py-1.5 px-3
              ${selectedGenres.includes(genre.id) 
                ? 'bg-primary hover:bg-primary/90' 
                : 'hover:bg-gray-100'
              }
            `}
            onClick={() => toggleGenre(genre.id)}
          >
            {genre.name}
          </Badge>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave}
          disabled={saveMutation.isPending || selectedGenres.length === 0}
        >
          {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
